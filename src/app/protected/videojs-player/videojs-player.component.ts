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

  player?: Player;
  private playerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mouseMoveListener: (() => void) | null = null;
  private fadeOutTimer: any = null;
  private qualityReady: boolean = false;
  private statsIntervalId: any = null;

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
      console.warn('no video player available');
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
    });

    this.player.ready(() => {
      console.log('tech', this.player?.techName_);
      console.log('source', this.player?.currentSource());

      const qualityLevels = (this.player as any).qualityLevels?.();

      if (qualityLevels && typeof qualityLevels.on === 'function') {
        console.log('hls quality levels working');
      } else {
        console.warn('no hls');
      }

      const qualityList = (
        this.player as PlayerWithQualityLevels
      ).qualityLevels();

      qualityList.on('addqualitylevel', () => {
        this.qualityLevels = [{ label: 'Auto', height: 'auto' }];
        console.log(
          'Vom Plugin erkannte Qualitätsstufen (Rohdaten der qualityList):',
          JSON.parse(JSON.stringify(qualityList))
        );

        for (let i = 0; i < qualityList.length; i++) {
          const level = qualityList[i];
          console.log(
            `Plugin Level <span class="math-inline">\{i\}\: ID\=</span>{level.id}, Höhe=<span class="math-inline">\{level\.height\}, Breite\=</span>{level.width || 'N/A'}, Bitrate=<span class="math-inline">\{level\.bitrate \|\| 'N/A'\} bps, Enabled\=</span>{level.enabled}`
          );

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
        console.log(
          'Für Dropdown generierte Qualitätslevel (this.qualityLevels):',
          this.qualityLevels
        );
      });

      if (this.statsIntervalId) {
        clearInterval(this.statsIntervalId);
      }
      this.logCurrentPlaybackStats();
    });
  }

  private initQualitySelector(): void {
    const tech = this.player?.tech({ IWillNotUseThisInPlugins: true }) as any;
    const reps = tech?.hls?.representations?.();

    if (!reps || reps.length === 0) {
      console.warn('no hls available');
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

    console.log('set quality to', this.qualityLevels);
  }

  private initQualityOptions(): void {
    this.player?.ready(() => {
      const tech = this.player?.tech({ IWillNotUseThisInPlugins: true }) as any;

      if (tech?.hls?.representations) {
        const reps = tech.hls.representations();
        this.qualityLevels = [{ label: 'Auto', height: 'auto' }];

        reps.forEach((rep: any) => {
          this.qualityLevels.push({
            label: `${rep.height}p`,
            height: rep.height,
          });
        });

        reps.forEach((rep: any) => rep.enabled(true));
      }
    });
  }

  onQualityChange(): void {
    if (!this.qualityReady || !this.player) {
      console.warn('⏳ Qualität noch nicht bereit.');
      return;
    }

    const tech = this.player.tech({ IWillNotUseThisInPlugins: true }) as any;
    const reps = tech?.hls?.representations?.();

    if (!reps || !Array.isArray(reps) || reps.length === 0) {
      console.warn(
        '❌ representations() nicht verfügbar oder leer. Fallback auf qualityLevels().'
      );

      const fallbackLevels = (
        this.player as PlayerWithQualityLevels
      ).qualityLevels();
      for (let i = 0; i < fallbackLevels.length; i++) {
        const level = fallbackLevels[i];
        level.enabled =
          this.selectedQuality === 'auto' ||
          level.height === this.selectedQuality;
      }

      return;
    }

    console.log('🔁 Setze Qualität auf:', this.selectedQuality);

    reps.forEach((rep: any) => {
      rep.enabled(
        this.selectedQuality === 'auto' || rep.height === this.selectedQuality
      );
    });

    setTimeout(() => {
      const selected = reps.find((r: any) => r.enabled?.());
      console.log(
        `✅ Aktive HLS Representation: ${selected?.height}p (${selected?.bandwidth}bps)`
      );

      const width = this.player?.videoWidth?.();
      const height = this.player?.videoHeight?.();
      console.log(`🎥 Gerendert: ${width}x${height}`);
    }, 1500);
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
    if (this.statsIntervalId) {
      clearInterval(this.statsIntervalId);
      this.statsIntervalId = null;
    }

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
    if (this.statsIntervalId) {
      clearInterval(this.statsIntervalId);
      this.statsIntervalId = null;
    }

    this.statsIntervalId = setInterval(() => {
      if (!this.player || this.player.isDisposed()) {
        return;
      }

      const width = this.player.videoWidth?.();
      const height = this.player.videoHeight?.();
      let playingQualityLabel = 'unbekannt';
      let currentBandwidthInfo = 'unbekannt';

      if (width && height) {
        playingQualityLabel = `${width}x${height}`;
      } else if (this.player.readyState() === 0) {
        playingQualityLabel = 'nicht initialisiert';
      } else if (this.player.readyState() < 2) {
        playingQualityLabel = 'lade Metadaten...';
      }

      try {
        const qualityLevelsPluginInstance = (
          this.player as PlayerWithQualityLevels
        )?.qualityLevels();

        if (
          qualityLevelsPluginInstance &&
          qualityLevelsPluginInstance.selectedIndex !== -1
        ) {
          const selectedLevelData =
            qualityLevelsPluginInstance[
              qualityLevelsPluginInstance.selectedIndex
            ];

          if (selectedLevelData) {
            if (typeof selectedLevelData.bitrate === 'number') {
              currentBandwidthInfo = `${Math.round(
                selectedLevelData.bitrate / 1000
              )} kbps (vom Plugin)`;
            } else {
              currentBandwidthInfo = `Level ${selectedLevelData.height}p (Plugin, keine Bitrate Info)`;
            }
          }
        } else if (
          this.selectedQuality === 'auto' &&
          qualityLevelsPluginInstance &&
          qualityLevelsPluginInstance.length > 0
        ) {
          currentBandwidthInfo = 'Auto (ABR aktiv)';
        }
      } catch (e) {
        currentBandwidthInfo = 'Fehler beim Plugin-Abruf';
      }

      console.log(
        `STATS: Auflösung: ${playingQualityLabel}, Gewählte Qualität (UI): ${this.selectedQuality}, Bandbreite/Level (Plugin): ${currentBandwidthInfo}`
      );
    }, 3000);
  }
}
