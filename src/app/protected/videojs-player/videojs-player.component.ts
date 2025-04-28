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

      this.player = videojs(this.videoPlayerRef.nativeElement, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        poster: this.poster || '',
        sources,
        fluid: true,
        controlBar: {
          volumePanel: { inline: false },
          fullscreenToggle: true,
        },
      });
      
    }
  }


  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = undefined;
    }
  }
}
