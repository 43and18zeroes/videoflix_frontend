import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VideoOfferService } from '../video-offer/video-offer.service';

@Component({
  selector: 'app-video-player',
  imports: [NgIf],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent {
  @Input() videoId: string | null = null;
  @Output() close = new EventEmitter<void>();

  videoUrl: string | null = null;
  private videoOfferService: VideoOfferService;

  constructor(videoOfferService: VideoOfferService) {
    this.videoOfferService = videoOfferService; // Weise die injizierte Instanz zu
  }

  ngOnChanges(): void {
    if (this.videoId) {
      this.loadVideoUrl(this.videoId);
    } else {
      this.videoUrl = null;
    }
  }

  loadVideoUrl(videoId: string): void {
    this.videoOfferService.getVideoUrlById(videoId).subscribe(response => {
      this.videoUrl = response.videoUrl;
      console.log('Video URL in Player Component:', this.videoUrl); // Hinzugefügt
    });
  }

  closePlayer(): void {
    this.videoId = null;
    this.videoUrl = null;
    this.close.emit();
  }
}
