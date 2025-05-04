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
// Entferne 'import type Player...' wenn nicht explizit benötigt oder stelle sicher, dass es korrekt ist
// import type Player from 'video.js/dist/types/player';
import videojs from 'video.js';
// Type für Player explizit importieren, falls benötigt
import Player from 'video.js/dist/types/player';


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
  @ViewChild('videoPlayer', { static: false }) videoPlayerRef?: ElementRef<HTMLVideoElement>;
  // ViewChild für den Close-Button hinzufügen
  @ViewChild('closeButton', { static: false }) closeButtonRef?: ElementRef<HTMLButtonElement>;

  player?: Player;
  private fadeOutTimer: any = null; // NodeJS.Timeout or number depending on environment
  private playerElement: HTMLElement | null = null; // Store player element for easy access/cleanup

  // Listener-Referenzen für die Bereinigung
  private mouseEnterListener: (() => void) | null = null;
  private mouseLeaveListener: (() => void) | null = null;

  // Renderer2 injizieren (optional, aber gute Praxis)
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Stelle sicher, dass der Button initial sichtbar ist (obwohl CSS es tun sollte)
     if (this.closeButtonRef?.nativeElement) {
       this.renderer.removeClass(this.closeButtonRef.nativeElement, 'fade-out');
     }
    this.tryInitPlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Init neu aufrufen, wenn sich die URL ändert (außer beim ersten Mal)
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
       this.cleanupPlayer(); // Erst aufräumen
       this.tryInitPlayer();
    } else if (changes['poster'] && this.player) {
       // Nur Poster aktualisieren, wenn Player existiert
       this.player.poster(this.poster || '');
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent) {
    // console.log('Escape key pressed'); // Zum Debuggen
    this.handleClose(); // Ruft die Methode zum Schließen auf
  }

  /**
   * Lauscht auf das Drücken der Leertaste im gesamten Dokument.
   * Wenn die Taste gedrückt wird, wird die Wiedergabe des Videos umgeschaltet (Play/Pause).
   * Verhindert das Standardverhalten der Leertaste (Scrollen).
   * @param event Das KeyboardEvent
   */
  @HostListener('document:keydown.space', ['$event'])
  handleSpaceKey(event: KeyboardEvent) {
    // Nur ausführen, wenn der Player initialisiert ist
    if (this.player) {
       // console.log('Space key pressed'); // Zum Debuggen

      // Verhindert das Standardverhalten der Leertaste (z.B. Scrollen der Seite)
      event.preventDefault();

      // Prüfen, ob das Video gerade pausiert ist oder läuft
      if (this.player.paused()) {
        this.player.play();
      } else {
        this.player.pause();
      }
    }
  }

  tryInitPlayer(): void {
    // Früheres Aufräumen, falls die Funktion direkt aufgerufen wird
    this.cleanupPlayer();

    if (this.videoPlayerRef?.nativeElement && this.videoUrl) {
      const videoElement = this.videoPlayerRef.nativeElement;

      // Stelle sicher, dass der Button-Ref existiert, bevor wir weitermachen
      if (!this.closeButtonRef?.nativeElement) {
        console.error('Close button reference not found!');
        return;
      }
      const closeButtonElement = this.closeButtonRef.nativeElement;

      // Initialisiere Video.js Player
      this.player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        poster: this.poster || '',
        sources: [
          {
            src: this.videoUrl,
            type: 'application/x-mpegURL', // Oder der passende Typ für deine URL
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

      // Speichere das Player-Element für Listener
      this.playerElement = this.player.el() as HTMLElement;

      // HLS Quality Selector (falls verwendet)
      const playerInstance = this.player as any;
      if (playerInstance.hlsQualitySelector) {
         playerInstance.hlsQualitySelector({ displayCurrentQuality: true });
      } else {
         console.warn('videojs-hls-quality-selector plugin not loaded or initialized.');
      }


      // --- Logik für den Close-Button ---

      // Stelle sicher, dass der Button zu Beginn sichtbar ist
      this.renderer.removeClass(closeButtonElement, 'fade-out');
      clearTimeout(this.fadeOutTimer); // Sicherstellen, dass kein alter Timer läuft

      // Listener für Maus betritt den Player-Bereich
      this.mouseEnterListener = this.renderer.listen(this.playerElement, 'mouseenter', () => {
        //console.log('Mouse Enter');
        clearTimeout(this.fadeOutTimer); // Timer stoppen
        this.renderer.removeClass(closeButtonElement, 'fade-out'); // Button sofort sichtbar machen
      });

      // Listener für Maus verlässt den Player-Bereich
      this.mouseLeaveListener = this.renderer.listen(this.playerElement, 'mouseleave', () => {
        //console.log('Mouse Leave');
        clearTimeout(this.fadeOutTimer); // Alten Timer löschen, falls vorhanden
        this.fadeOutTimer = setTimeout(() => {
          //console.log('Fading out');
          this.renderer.addClass(closeButtonElement, 'fade-out'); // Button nach 2 Sek ausblenden
        }, 2000); // 2 Sekunden Verzögerung
      });

      // Starte den Timer initial, da die Maus wahrscheinlich nicht über dem Player ist
      this.startInitialFadeOutTimer();

      // --- Ende Logik für den Close-Button ---

    } else {
       console.warn('Video player element or videoUrl not available for initialization.');
    }
  }

  // Funktion zum Starten des initialen Fade-Out-Timers
  private startInitialFadeOutTimer(): void {
    if (!this.closeButtonRef?.nativeElement) return;
    const closeButtonElement = this.closeButtonRef.nativeElement;

    clearTimeout(this.fadeOutTimer); // Sicherstellen, dass kein Timer läuft
    this.fadeOutTimer = setTimeout(() => {
        //console.log('Initial fade out triggered');
        this.renderer.addClass(closeButtonElement, 'fade-out');
    }, 2000);
  }

  // Funktion zum Aufräumen des Players und der Listener
  private cleanupPlayer(): void {
     // Entferne Event Listener, falls vorhanden
     if (this.mouseEnterListener) {
       this.mouseEnterListener(); // Aufruf der von renderer.listen zurückgegebenen Funktion entfernt den Listener
       this.mouseEnterListener = null;
     }
     if (this.mouseLeaveListener) {
       this.mouseLeaveListener();
       this.mouseLeaveListener = null;
     }

     // Timer löschen
     clearTimeout(this.fadeOutTimer);

     // Player entsorgen
     if (this.player) {
       this.player.dispose();
       this.player = undefined;
       this.playerElement = null;
     }
  }

  ngOnDestroy(): void {
    // Komponente wird zerstört -> alles aufräumen
    this.cleanupPlayer();
  }

  handleClose(): void {
    this.close.emit();
  }
}