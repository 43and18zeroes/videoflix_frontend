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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Player from 'video.js/dist/types/player';
import videojs from 'video.js';

interface PlayerWithQualityLevels extends Player {
  qualityLevels(): {
    length: number;
    [index: number]: {
      height: number;
      enabled: boolean;
    };
    on(event: string, callback: () => void): void;
  };
}

@Component({
  selector: 'app-videojs-player',
  templateUrl: './videojs-player.component.html',
  imports: [CommonModule, FormsModule],
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
  private playerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mouseMoveListener: (() => void) | null = null;
  private fadeOutTimer: any = null;
  private qualityReady: boolean = false;

  qualityLevels: { label: string; height: number | 'auto' }[] = [];
  selectedQuality: number | 'auto' = 'auto';

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.showCloseButton();
    this.initPlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      this.cleanupPlayer();
      this.initPlayer();
    } else if (changes['poster'] && this.player) {
      this.player.poster(this.poster || '');
    }
  }

  ngOnDestroy(): void {
    this.cleanupPlayer();
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    this.handleClose();
  }

  @HostListener('document:keydown.space', ['$event'])
  handleSpaceKey(event: KeyboardEvent) {
    if (this.player) {
      event.preventDefault();
      this.player.paused() ? this.player.play() : this.player.pause();
    }
  }

  handleClose(): void {
    this.close.emit();
  }

  private initPlayer(): void {
    if (!this.videoPlayerRef?.nativeElement || !this.videoUrl) {
      console.warn(
        'Video player element or videoUrl not available for initialization.'
      );
      return;
    }

    this.cleanupPlayer();
    this.setupVideoJsPlayer();
    this.initAspectRatioHandling();
    this.setupInteractionHandlers();
  }

  private setupVideoJsPlayer(): void {
    this.initializeVideoJsInstance();
    this.storePlayerElement();
  }

  private initializeVideoJsInstance(): void {
    this.player = videojs(this.videoPlayerRef!.nativeElement, {
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
    });

    this.player.ready(() => {
      console.log('Aktivierte Technik:', this.player?.techName_);
      console.log('Verwendete Quelle:', this.player?.currentSource());

      const qualityLevels = (this.player as any).qualityLevels?.();

      if (qualityLevels && typeof qualityLevels.on === 'function') {
        console.log('✅ HLS-Qualitätslevels erkannt');
      } else {
        console.warn('❌ Kein HLS erkannt oder qualityLevels() fehlt');
      }

      const qualityList = (
        this.player as PlayerWithQualityLevels
      ).qualityLevels();

      qualityList.on('addqualitylevel', () => {
        this.qualityLevels = [{ label: 'Auto', height: 'auto' }];

        for (let i = 0; i < qualityList.length; i++) {
          const level = qualityList[i];
          this.qualityLevels.push({
            label: `${level.height}p`,
            height: level.height,
          });
        }

        this.selectedQuality = 'auto';
        this.qualityReady = true;
      });

      // ➕ Hier der Aufruf deiner Statistikfunktion:
      this.logCurrentPlaybackStats();
    });
  }

  private initQualitySelector(): void {
    const tech = this.player?.tech({ IWillNotUseThisInPlugins: true }) as any;
    const reps = tech?.hls?.representations?.();

    if (!reps || reps.length === 0) {
      console.warn('⚠️ Noch keine HLS Representations verfügbar.');
      return;
    }

    this.qualityLevels = [{ label: 'Auto', height: 'auto' }];

    reps.forEach((rep: any) => {
      if (!this.qualityLevels.find((q) => q.height === rep.height)) {
        this.qualityLevels.push({
          label: `${rep.height}p`,
          height: rep.height,
        });
      }
    });

    this.selectedQuality = 'auto';
    this.qualityReady = true;

    console.log('📶 Qualitätsstufen geladen:', this.qualityLevels);
  }

  private initQualityOptions(): void {
    this.player?.ready(() => {
      const tech = this.player?.tech({ IWillNotUseThisInPlugins: true }) as any;

      if (tech?.hls?.representations) {
        const reps = tech.hls.representations();

        // „Auto“-Modus als Standard
        this.qualityLevels = [{ label: 'Auto', height: 'auto' }];

        // Alle verfügbaren Renditions einfügen
        reps.forEach((rep: any) => {
          this.qualityLevels.push({
            label: `${rep.height}p`,
            height: rep.height,
          });
        });

        // Standard: Alle aktivieren (Auto-Modus)
        reps.forEach((rep: any) => rep.enabled(true));
      }
    });
  }

  onQualityChange(): void {
    const tech = this.player?.tech({ IWillNotUseThisInPlugins: true }) as any;
    const reps = tech?.hls?.representations?.();

    if (!reps || reps.length === 0) {
      console.warn('⚠️ Noch keine HLS Representations verfügbar.');
      return;
    }

    console.log('🔁 Setze Qualität auf:', this.selectedQuality);

    reps.forEach((rep: any) => {
      rep.enabled(
        this.selectedQuality === 'auto' || rep.height === this.selectedQuality
      );
    });

    setTimeout(() => {
      const current = this.player?.currentHeight?.();
      console.log('✅ Aktive Auflösung nach Auswahl:', current);
    }, 2000);
  }

  private storePlayerElement(): void {
    if (this.player) {
      this.playerElement = this.player.el() as HTMLElement;
    }
  }

  private setupInteractionHandlers(): void {
    this.initCloseButtonBehavior();
    this.initPlayerEvents();
  }

  private initAspectRatioHandling(): void {
    if (!this.playerElement) return;

    this.setAspectRatio();
    this.resizeObserver = new ResizeObserver(() => this.setAspectRatio());
    this.resizeObserver.observe(
      this.playerElement.parentElement as HTMLElement
    );
  }

  private setAspectRatio(): void {
    if (!this.playerElement) return;

    const width = this.playerElement.offsetWidth;
    const height = width * (9 / 16);
    this.renderer.setStyle(this.playerElement, 'height', `${height}px`);
  }

  private initCloseButtonBehavior(): void {
    if (!this.playerElement || !this.closeButtonRef?.nativeElement) return;

    this.mouseMoveListener = this.renderer.listen(
      this.playerElement,
      'mousemove',
      () => {
        this.showCloseButton();
        this.clearFadeOutTimer();
        this.startFadeOutTimer();
      }
    );

    this.startFadeOutTimer();
  }

  private initPlayerEvents(): void {
    if (!this.player) return;

    this.player.on('pause', () => {
      this.showCloseButton();
      this.clearFadeOutTimer();
    });

    this.player.on('play', () => {
      this.clearFadeOutTimer();
      this.startFadeOutTimer();
    });
  }

  private startFadeOutTimer(): void {
    if (!this.closeButtonRef?.nativeElement) return;

    this.fadeOutTimer = setTimeout(() => {
      if (this.player && !this.player.paused()) {
        this.hideCloseButton();
      }
    }, 2000);
  }

  private clearFadeOutTimer(): void {
    clearTimeout(this.fadeOutTimer);
    this.fadeOutTimer = null;
  }

  private showCloseButton(): void {
    if (!this.closeButtonRef?.nativeElement) return;
    this.renderer.removeClass(this.closeButtonRef.nativeElement, 'fade-out');
  }

  private hideCloseButton(): void {
    if (!this.closeButtonRef?.nativeElement) return;
    this.renderer.addClass(this.closeButtonRef.nativeElement, 'fade-out');
  }

  private cleanupPlayer(): void {
    this.removeMouseListeners();
    this.clearFadeOutTimer();
    this.disconnectResizeObserver();
    this.disposePlayerInstance();
  }

  private removeMouseListeners(): void {
    if (this.mouseMoveListener) {
      this.mouseMoveListener();
      this.mouseMoveListener = null;
    }
  }

  private disconnectResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private disposePlayerInstance(): void {
    if (this.player) {
      this.player.dispose();
      this.player = undefined;
      this.playerElement = null;
    }
  }

  private logCurrentPlaybackStats(): void {
    setInterval(() => {
      const width = this.player?.videoWidth?.();
      const height = this.player?.videoHeight?.();
      const tech = this.player?.tech({ IWillNotUseThisInPlugins: true }) as any;

      let activeBandwidth = 'unbekannt';
      const reps = tech?.hls?.representations?.();

      const activeRep = reps?.find((rep: any) => rep.enabled?.());
      if (activeRep?.bandwidth) {
        activeBandwidth = `${Math.round(activeRep.bandwidth / 1000)} kbps`;
      }

      console.log(
        `🎥 Aktuell gerendert: ${width}x${height}, Bitrate: ${activeBandwidth}`
      );
    }, 2000);
  }
}
