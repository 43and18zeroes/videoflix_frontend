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

interface QualityLevel {
  id: string;
  width?: number;
  height: number;
  bitrate?: number;
  enabled: boolean;
}

interface QualityLevelList {
  length: number;
  selectedIndex: number;
  on(event: string, callback: (...args: any[]) => void): void;
  [index: number]: QualityLevel;
}

interface PlayerWithQualityLevels extends Player {
  qualityLevels(): QualityLevelList;
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

  @ViewChild('qualitySelector', { static: false })
  qualitySelectorRef?: ElementRef<HTMLDivElement>;

  player?: Player;
  private playerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mouseMoveListener: (() => void) | null = null;
  private fadeOutTimer: any = null;
  private qualityReady: boolean = false;
  private statsIntervalId: any = null;
  private touchPlayPauseListener: (() => void) | null = null;
  private overlayClickListener: (() => void) | null = null;

  qualityLevels: { label: string; height: number | 'auto' }[] = [];
  selectedQuality: number | 'auto' = 'auto';

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

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
      return;
    }

    this.cleanupPlayer();
    this.setupVideoJsPlayer();
    this.initAspectRatioHandling();
    this.setupInteractionHandlers();
    this.initOverlayClose();
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
      html5: {
        vhs: {
          enableLowInitialPlaylist: true,
          useDevicePixelRatio: false,
          smoothQualityChange: true,
        },
      },
      sources: [
        {
          src: this.videoUrl,
          type: 'application/x-mpegURL',
        },
      ],
      controlBar: {
        pictureInPictureToggle: false,
      },
    });

    this.player.ready(() => {
      const qualityLevels = (this.player as any).qualityLevels?.();
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
        this.qualityLevels.sort((a, b) => {
          if (a.height === 'auto') return -1;
          if (b.height === 'auto') return 1;
          if (typeof a.height === 'number' && typeof b.height === 'number') {
            return b.height - a.height;
          }
          return 0;
        });

        this.selectedQuality = 'auto';
        this.qualityReady = true;
      });

      if (this.statsIntervalId) {
        clearInterval(this.statsIntervalId);
      }
      this.logCurrentPlaybackStats();
    });
  }

  onQualityChange(): void {
    if (!this.qualityReady || !this.player) return;

    const qualityLevels = (
      this.player as PlayerWithQualityLevels
    ).qualityLevels?.();
    if (!qualityLevels || qualityLevels.length === 0) return;

    for (let i = 0; i < qualityLevels.length; i++) {
      const level = qualityLevels[i];

      // "Auto" = alle Levels aktivieren, sonst nur das eine passende
      if (this.selectedQuality === 'auto') {
        level.enabled = true;
      } else {
        level.enabled = level.height === this.selectedQuality;
      }
    }

    console.log(`[QualityChange] Auswahl: ${this.selectedQuality}`);
  }

  private storePlayerElement(): void {
    if (this.player) {
      this.playerElement = this.player.el() as HTMLElement;
    }
  }

  private setupInteractionHandlers(): void {
    this.initCloseButtonBehavior();
    this.initPlayerEvents();
    this.initTouchPlayPause();
  }

  private initOverlayClose(): void {
    // Entferne den alten Listener, falls vorhanden
    this.removeOverlayClickListener();

    // Listener auf dem Host-Element (dem gesamten Overlay-Div) anbringen
    // Wir nutzen 'click' hier, da es auch Touch-Taps abdeckt und einfacher ist.
    // Falls "touchstart" auf dem Overlay nicht funktioniert (z.B. weil es von dem Player
    // selbst mit preventDefault überschrieben wird), kann man hier auch "click" lassen.
    this.overlayClickListener = this.renderer.listen(
      this.elementRef.nativeElement, // Das ist das Host-Element (<app-videojs-player>)
      'click', // Kann auch 'touchend' oder 'mousedown' sein, je nach gewünschtem Verhalten
      (event: MouseEvent | TouchEvent) => {
        const target = event.target as HTMLElement;

        // Überprüfen, ob der Klick/Tap auf dem Videoplayer oder einem seiner Steuerelemente erfolgte
        // Wenn der Klick auf dem Player selbst oder dessen Controls war, tun wir nichts.
        // Das playerElement ist der Container für den VideoJS-Player.
        if (this.playerElement && this.playerElement.contains(target)) {
          return; // Der Klick war innerhalb des Players, nicht auf dem Hintergrund
        }

        // Wenn der Klick nicht auf dem Player oder seinen Controls war,
        // dann wurde der Hintergrund (das Overlay) geklickt.
        this.handleClose();
      }
    );
  }

  private removeOverlayClickListener(): void {
    if (this.overlayClickListener) {
      this.overlayClickListener();
      this.overlayClickListener = null;
    }
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

  private initTouchPlayPause(): void {
    if (!this.playerElement || !this.player) return;

    this.removeTouchPlayPauseListener();

    this.touchPlayPauseListener = () => {
      this.playerElement?.addEventListener(
        'touchstart',
        this.touchStartHandler,
        { passive: true }
      );
    };

    this.touchPlayPauseListener();
  }

  private touchStartHandler = (event: TouchEvent): void => {
    const target = event.target as HTMLElement;

    if (
      target.closest('.vjs-control-bar') ||
      target.closest('.vjs-big-play-button') ||
      target.closest('.vjs-control') ||
      target.closest('.vjs-button') ||
      target.closest('.close-button') ||
      target.closest('.quality-selector')
    ) {
      return;
    }

    // Kein preventDefault wegen passive: true
    if (this.player) {
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  };

  private removeTouchPlayPauseListener(): void {
    if (this.playerElement && this.touchStartHandler) {
      this.playerElement.removeEventListener(
        'touchstart',
        this.touchStartHandler
      );
    }
    this.touchPlayPauseListener = null;
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
    if (this.closeButtonRef?.nativeElement) {
      this.renderer.removeClass(this.closeButtonRef.nativeElement, 'fade-out');
    }
    if (this.qualitySelectorRef?.nativeElement) {
      this.renderer.removeClass(
        this.qualitySelectorRef.nativeElement,
        'fade-out'
      );
    }
  }

  private hideCloseButton(): void {
    if (this.closeButtonRef?.nativeElement) {
      this.renderer.addClass(this.closeButtonRef.nativeElement, 'fade-out');
    }
    if (this.qualitySelectorRef?.nativeElement) {
      this.renderer.addClass(this.qualitySelectorRef.nativeElement, 'fade-out');
    }
  }

  private cleanupPlayer(): void {
    if (this.statsIntervalId) {
      clearInterval(this.statsIntervalId);
      this.statsIntervalId = null;
    }

    this.removeMouseListeners();
    this.removeTouchPlayPauseListener();
    this.removeOverlayClickListener();
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
    if (this.statsIntervalId) {
      clearInterval(this.statsIntervalId);
      this.statsIntervalId = null;
    }

    this.statsIntervalId = setInterval(() => {
      if (!this.player || this.player.isDisposed()) return;

      // Tatsächliche Auflösung des wiedergegebenen Videos
      const videoWidth = this.player.videoWidth?.();
      const videoHeight = this.player.videoHeight?.();
      const resolution =
        videoWidth && videoHeight
          ? `${videoWidth}x${videoHeight}`
          : 'unbekannt';

      // Aktives QualityLevel laut Plugin
      let pluginLabel = 'unbekannt';
      let pluginBitrate = 'unbekannt';
      let pluginHeight = 'unbekannt';
      let pluginInfo = null;

      try {
        const qualityLevelsPlugin = (
          this.player as PlayerWithQualityLevels
        ).qualityLevels?.();

        if (qualityLevelsPlugin && qualityLevelsPlugin.selectedIndex !== -1) {
          const currentLevel =
            qualityLevelsPlugin[qualityLevelsPlugin.selectedIndex];

          if (currentLevel) {
            pluginHeight = `${currentLevel.height}p`;
            pluginBitrate = currentLevel.bitrate
              ? `${Math.round(currentLevel.bitrate / 1000)} kbps`
              : 'keine Bitrate verfügbar';
            pluginInfo = currentLevel;
          }
        }
      } catch (e) {
        pluginLabel = 'Fehler beim Auslesen';
      }

      console.log(
        `[Stream Check] Auflösung im Player: ${resolution} | Aktives Plugin-Level: ${pluginHeight} @ ${pluginBitrate}`,
        pluginInfo
      );
    }, 2000);
  }
}
