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
    });

    this.player.ready(() => {
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

        // NEUE LOGIK HIER STARTET
        const preferredQuality = 1080; // Die gewünschte Qualität
        let foundPreferredQuality = false;

        // Versuche, 1080p zu finden und zu aktivieren
        for (let i = 0; i < qualityList.length; i++) {
          const level = qualityList[i];
          if (level.height === preferredQuality) {
            level.enabled = true; // Aktiviere diese Qualitätsstufe
            this.selectedQuality = preferredQuality; // Setze die ausgewählte Qualität im Dropdown
            foundPreferredQuality = true;
          } else {
            level.enabled = false; // Deaktiviere alle anderen Qualitätsstufen
          }
        }

        // Falls 1080p nicht gefunden wurde, falle auf die höchste verfügbare Qualität zurück oder "Auto"
        if (!foundPreferredQuality) {
          console.warn(
            `1080p-Qualität nicht gefunden für Video: ${this.videoUrl}. Versuche, die höchste verfügbare Qualität zu verwenden.`
          );
          // Optional: Hier könntest du die höchste verfügbare Qualität automatisch auswählen
          const highestQuality = this.qualityLevels
            .filter((q) => typeof q.height === 'number')
            .sort((a, b) => (b.height as number) - (a.height as number))[0];

          if (highestQuality) {
            this.selectedQuality = highestQuality.height;
            for (let i = 0; i < qualityList.length; i++) {
              const level = qualityList[i];
              level.enabled = level.height === highestQuality.height;
            }
          } else {
            this.selectedQuality = 'auto'; // Fallback auf Auto, wenn keine nummerische Qualität gefunden
          }
        }
        // NEUE LOGIK HIER ENDET

        this.qualityReady = true;
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
      return;
    }

    const tech = this.player.tech({ IWillNotUseThisInPlugins: true }) as any;
    const reps = tech?.hls?.representations?.();

    if (!reps || !Array.isArray(reps) || reps.length === 0) {
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

    reps.forEach((rep: any) => {
      rep.enabled(
        this.selectedQuality === 'auto' || rep.height === this.selectedQuality
      );
    });
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
    if (!this.playerElement || !this.player) {
      return;
    }

    // Entferne den alten Listener, falls vorhanden, um Duplikate zu vermeiden
    this.removeTouchPlayPauseListener();

    // Füge einen Event Listener für 'click' oder 'touchstart' hinzu
    // 'click' funktioniert oft auch auf Touch-Geräten, aber 'touchstart' ist spezifischer.
    // Probiere zuerst 'click' und wechsle zu 'touchstart', falls es Probleme gibt.
    this.touchPlayPauseListener = this.renderer.listen(
      this.playerElement,
      'touchstart', // Oder 'touchstart'
      (event: Event) => {
        // Verhindere, dass der Event auf Elemente innerhalb des Players
        // weitergeleitet wird (z.B. Kontrollleisten), die eigene Logik haben.
        // Dies stellt sicher, dass ein Klick auf das Video selbst reagiert.
        const target = event.target as HTMLElement;

        // Überprüfen, ob der Klick auf ein Steuerelement oder einen Button erfolgte
        if (
          target.closest('.vjs-control-bar') || // Kontrollleiste
          target.closest('.vjs-big-play-button') || // Großer Play-Button
          target.closest('.vjs-control') || // Einzelne Video.js-Steuerelemente
          target.closest('.vjs-button') || // Allgemeine Video.js-Buttons
          target.closest('.close-button') || // <--- NEU: Dein Schließen-Button
          target.closest('.quality-selector') // <--- NEU: Dein Qualitätsauswahl
        ) {
          // Wenn der Touch auf einem dieser interaktiven Elemente war,
          // lassen wir den Browser seine Standardaktion ausführen (z.B. den Klick des Buttons).
          // Daher KEIN event.preventDefault() hier.
          return;
        }

        // Wenn der Player pausiert ist, spiele ihn ab.
        // Wenn der Player abspielt, pausiere ihn.
        if (this.player) {
          event.preventDefault(); // Verhindert Standardaktionen des Browsers
          if (this.player.paused()) {
            this.player.play();
          } else {
            this.player.pause();
          }
        }
      }
    );
  }

  private removeTouchPlayPauseListener(): void {
    if (this.touchPlayPauseListener) {
      this.touchPlayPauseListener(); // Ruft die Unsubscribe-Funktion auf
      this.touchPlayPauseListener = null;
    }
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
    }, 3000);
  }
}
