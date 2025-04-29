import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
} from '@angular/core';
import { EventEmitter } from 'stream';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

interface VideoUrls {
  '480p'?: string;
  '720p'?: string;
  '1080p'?: string;
  original?: string;
}

@Component({
  selector: 'app-videojs-player',
  templateUrl: './videojs-player.component.html',
  styleUrls: ['./videojs-player.component.scss'],
})
export class VideojsPlayerComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() videoUrls: VideoUrls | null = null; // Hier sollte @Input() stehen
  @Input() poster: string | null = null;
  @ViewChild('videoPlayer', { static: false }) videoPlayerRef?: ElementRef;

  player?: Player;
  private videoMetadataListener: (() => void) | null = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (
      this.videoPlayerRef &&
      this.videoUrls &&
      typeof videojs !== 'undefined'
    ) {
      const sources: any[] = [];
      if (this.videoUrls['original']) {
        sources.push({ src: this.videoUrls['original'], type: 'video/mp4' });
      }
      if (this.videoUrls['480p']) {
        sources.push({
          src: this.videoUrls['480p'],
          type: 'video/mp4',
          label: '480p',
          selected: true,
        }); // Standard
      }
      if (this.videoUrls['720p']) {
        sources.push({
          src: this.videoUrls['720p'],
          type: 'video/mp4',
          label: '720p',
        });
      }
      if (this.videoUrls['1080p']) {
        sources.push({
          src: this.videoUrls['1080p'],
          type: 'video/mp4',
          label: '1080p',
        });
      }

      const videoElement = this.videoPlayerRef.nativeElement;

      this.player = videojs(videoElement, {
        controls: true,
        autoplay: true, // Vorsicht mit Autoplay, Browser blockieren es oft
        preload: 'auto',
        poster: this.poster || '',
        sources,
        fluid: false, // WICHTIG: Deaktivieren, da wir das Seitenverhältnis manuell setzen
        controlBar: {
          volumePanel: { inline: false },
          fullscreenToggle: true,
        },
      });

      this.videoMetadataListener = () => {
        if (this.player && videoElement) { // Sicherstellen, dass player und Element existieren
          const videoWidth = this.player.videoWidth();
          const videoHeight = this.player.videoHeight();

          if (videoWidth > 0 && videoHeight > 0) {
            const ratio = videoWidth / videoHeight;
            // Setze das 'aspect-ratio' direkt am Container-Element (.video-js)
            videoElement.parentElement?.style.setProperty('aspect-ratio', `${ratio}`);
            // Optional: Hintergrund entfernen, wenn das Video geladen ist
            // videoElement.parentElement?.style.backgroundColor = 'transparent';
          } else {
            // Fallback, falls Dimensionen nicht verfügbar sind
            videoElement.parentElement?.style.setProperty('aspect-ratio', '16 / 9');
            // videoElement.parentElement?.style.backgroundColor = 'black'; // Behalte den Hintergrund
          }
        }
      };

      this.player.on('loadedmetadata', this.videoMetadataListener);

    } else {
        console.error("Video Player Referenz, Video URLs oder Video.js nicht verfügbar.");
    
  
      
    }
  }


  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = undefined;
    }
  }
}
