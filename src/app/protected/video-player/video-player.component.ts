import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { VideoOfferService } from '../video-offer/video-offer.service';

@Component({
  selector: 'app-video-player',
  imports: [NgIf],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit, OnChanges {
  @Input() videoId: string | null = null;
  @Output() close = new EventEmitter<void>();

  videoUrl: string | null = null;

  constructor(private videoOfferService: VideoOfferService) {}

  ngOnInit(): void {
    this.adjustVideoQuality();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustVideoQuality();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['videoId'] && this.videoId) {
      this.loadVideoUrl(this.videoId);
    } else if (changes['videoId']) {
      this.videoUrl = null;
    }
  }

  private loadVideoUrl(videoId: string): void {
    this.videoOfferService.getVideoUrlById(videoId).subscribe(response => {
      this.videoUrl = this.appendResolution(response.videoUrl);
      console.log('Video URL in Player Component:', this.videoUrl);
    });
  }

  private appendResolution(baseUrl: string): string {
    const width = window.innerWidth;
  
    const resolution = width < 854
      ? '-854x480'
      : width < 1280
        ? '-1280x720'
        : '-1920x1080';
  
    // Insert resolution before ".mp4"
    return baseUrl.replace(/\.mp4$/, `${resolution}.mp4`);
  }
  

  private adjustVideoQuality(): void {
    if (this.videoUrl && this.videoId) {
      this.loadVideoUrl(this.videoId); // neu laden mit angepasster Auflösung
    }
  }

  closePlayer(): void {
    this.videoId = null;
    this.videoUrl = null;
    this.close.emit();
  }

  logVideoResolution(video: HTMLVideoElement): void {
    console.log(`Native Video-Auflösung: ${video.videoWidth} x ${video.videoHeight}`);
  }
}

