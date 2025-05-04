import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  Renderer2,
  HostListener,
} from '@angular/core';
import Player from 'video.js/dist/types/player';
import videojs from 'video.js';

@Component({
  selector: 'app-videojs-player',
  templateUrl: './videojs-player.component.html',
  styleUrls: ['./videojs-player.component.scss'],
})
export class VideojsPlayerComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input() videoUrl: string = '';
  @Input() poster: string | null = null;
  @Output() close = new EventEmitter<void>();
  @ViewChild('videoPlayer', { static: false })
  videoPlayerRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('closeButton', { static: false })
  closeButtonRef?: ElementRef<HTMLButtonElement>;

  player?: Player;
  private fadeOutTimer: any = null;
  private playerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;

  private mouseEnterListener: (() => void) | null = null;
  private mouseLeaveListener: (() => void) | null = null;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.closeButtonRef?.nativeElement) {
      this.renderer.removeClass(this.closeButtonRef.nativeElement, 'fade-out');
    }
    this.tryInitPlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      this.cleanupPlayer();
      this.tryInitPlayer();
    } else if (changes['poster'] && this.player) {
      this.player.poster(this.poster || '');
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.handleClose();
  }

  @HostListener('document:keydown.space', ['$event'])
  handleSpaceKey(event: KeyboardEvent) {
    if (this.player) {
      event.preventDefault();
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }

  tryInitPlayer(): void {
    this.cleanupPlayer();

    if (this.videoPlayerRef?.nativeElement && this.videoUrl) {
      const videoElement = this.videoPlayerRef.nativeElement;

      if (!this.closeButtonRef?.nativeElement) {
        console.error('Close button reference not found!');
        return;
      }
      const closeButtonElement = this.closeButtonRef.nativeElement;

      this.player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        poster: this.poster || '',
        sources: [
          {
            src: this.videoUrl,
            type: 'application/x-mpegURL',
          },
        ],
        controlBar: {
          children: [
            'playToggle',
            'progressControl',
            'volumePanel',
            'qualitySelector',
            'fullscreenToggle',
          ],
        },
      });

      this.playerElement = this.player.el() as HTMLElement;

      const playerInstance = this.player as any;
      if (playerInstance.hlsQualitySelector) {
        playerInstance.hlsQualitySelector({ displayCurrentQuality: true });
      } else {
        console.warn(
          'videojs-hls-quality-selector plugin not loaded or initialized.'
        );
      }

      // --- Erzwinge 16:9 Seitenverhältnis mit JavaScript ---
      this.setAspectRatio();
      this.resizeObserver = new ResizeObserver(() => {
        this.setAspectRatio();
      });
      this.resizeObserver.observe(
        this.playerElement.parentElement as HTMLElement
      );
      // --- Ende Erzwinge 16:9 Seitenverhältnis mit JavaScript ---

      // --- Logik für den Close-Button ---
      this.renderer.removeClass(closeButtonElement, 'fade-out');
      clearTimeout(this.fadeOutTimer);

      this.mouseEnterListener = this.renderer.listen(
        this.playerElement,
        'mouseenter',
        () => {
          this.renderer.removeClass(closeButtonElement, 'fade-out'); // Sofort sichtbar beim Hover
        }
      );

      this.mouseLeaveListener = this.renderer.listen(
        this.playerElement,
        'mouseleave',
        () => {
          clearTimeout(this.fadeOutTimer);
          this.fadeOutTimer = setTimeout(() => {
            this.renderer.addClass(closeButtonElement, 'fade-out');
          }, 2000);
        }
      );

      this.startInitialFadeOutTimer();
      // --- Ende Logik für den Close-Button ---
    } else {
      console.warn(
        'Video player element or videoUrl not available for initialization.'
      );
    }
  }

  private setAspectRatio(): void {
    if (this.playerElement) {
      const playerWidth = this.playerElement.offsetWidth;
      const playerHeight = playerWidth * (9 / 16); // Berechne die Höhe für 16:9

      this.renderer.setStyle(this.playerElement, 'height', `${playerHeight}px`);
    }
  }

  private startInitialFadeOutTimer(): void {
    if (!this.closeButtonRef?.nativeElement) return;
    const closeButtonElement = this.closeButtonRef.nativeElement;

    clearTimeout(this.fadeOutTimer);
    this.fadeOutTimer = setTimeout(() => {
      this.renderer.addClass(closeButtonElement, 'fade-out');
    }, 2000);
  }

  private cleanupPlayer(): void {
    if (this.mouseEnterListener) {
      this.mouseEnterListener();
      this.mouseEnterListener = null;
    }
    if (this.mouseLeaveListener) {
      this.mouseLeaveListener();
      this.mouseLeaveListener = null;
    }

    clearTimeout(this.fadeOutTimer);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.player) {
      this.player.dispose();
      this.player = undefined;
      this.playerElement = null;
    }
  }

  ngOnDestroy(): void {
    this.cleanupPlayer();
  }

  handleClose(): void {
    this.close.emit();
  }
}
