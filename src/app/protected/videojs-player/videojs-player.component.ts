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
} from '@angular/core';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
// import 'videojs-hls-quality-selector';

@Component({
  selector: 'app-videojs-player',
  templateUrl: './videojs-player.component.html',
  styleUrls: ['./videojs-player.component.scss'],
})
export class VideojsPlayerComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() videoUrl: string = '';
  @Input() poster: string | null = null;
  @ViewChild('videoPlayer', { static: false }) videoPlayerRef?: ElementRef;

  player?: Player;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.tryInitPlayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoUrl'] && !changes['videoUrl'].firstChange) {
      this.tryInitPlayer();
    }
  }

  tryInitPlayer(): void {
    if (this.player) {
      this.player.dispose(); // Bestehenden Player sauber zerstören
      this.player = undefined;
    }
  
    if (this.videoPlayerRef && this.videoUrl) {
      console.log('Initialisiere Player mit URL:', this.videoUrl);
      const videoElement = this.videoPlayerRef.nativeElement;
  
      this.player = videojs(videoElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        poster: this.poster || '',
        sources: [{
          src: this.videoUrl,
          type: 'application/x-mpegURL',
        }],
        controlBar: {
          volumePanel: { inline: false },
          fullscreenToggle: true,
        },
      });
  
      // Plugins müssen hier nicht erneut registriert werden!
      // `qualityLevels()` ist nach dem Import global verfügbar.
    }
  }
  

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = undefined;
    }
  }
}
