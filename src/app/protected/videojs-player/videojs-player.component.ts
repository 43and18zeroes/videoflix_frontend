import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';

import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-videojs-player',
  templateUrl: './videojs-player.component.html',
  styleUrls: ['./videojs-player.component.scss'],
})
export class VideojsPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() videoUrl: string | null = null;
  @Input() poster: string | null = null;
  @ViewChild('videoPlayer', { static: false }) videoPlayerRef?: ElementRef;

  player: Player | undefined;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.videoPlayerRef && this.videoUrl && typeof videojs !== 'undefined') {
      this.player = videojs(this.videoPlayerRef.nativeElement, {
        controls: true,
        autoplay: false,
        preload: 'auto',
        poster: this.poster || '',
        sources: [{
          src: this.videoUrl,
          type: 'video/mp4',
        }],
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
