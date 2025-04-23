import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() {}

  ngOnChanges(): void {
    if (this.videoId) {
      this.loadVideoUrl(this.videoId);
    } else {
      this.videoUrl = null;
    }
  }

  loadVideoUrl(videoId: string): void {
    // Hier rufen wir den Backend-Endpunkt auf, um die Video-URL basierend auf der ID zu erhalten
    // Verwenden Sie Ihren VideoOfferService dafür
    // Beispiel:
    // this.videoOfferService.getVideoUrlById(videoId).subscribe(url => {
    //   this.videoUrl = url;
    // });

    // *** Platzhalter für die tatsächliche Backend-Anfrage ***
    // Ersetze dies durch deinen tatsächlichen API-Aufruf
    this.videoUrl = `http://127.0.0.1:8000/api/videos/${videoId}/play/`;
    console.log('Lade Video-URL für ID:', videoId, 'URL:', this.videoUrl);
  }

  closePlayer(): void {
    this.videoId = null;
    this.videoUrl = null;
    this.close.emit();
  }
}
