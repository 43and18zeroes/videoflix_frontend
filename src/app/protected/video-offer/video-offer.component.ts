import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { ProtectedFooterComponent } from '../components/protected-footer/protected-footer.component';
import { ThumbnailsSectionComponent } from './thumbnails-section/thumbnails-section.component';
import { VideoOfferService } from './video-offer.service';
// Importiere die neue VideojsPlayerComponent
import { VideojsPlayerComponent } from '../videojs-player/videojs-player.component';

interface VideoSection {
  title: string;
  thumbnails: { thumbnailUrl: string; videoId: string; altText?: string }[];
}

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [
    ProtectedHeaderComponent,
    ProtectedFooterComponent,
    ThumbnailsSectionComponent,
    NgFor,
    NgIf,
    // Füge die VideojsPlayerComponent zu den Imports hinzu
    VideojsPlayerComponent,
  ],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
  providers: [VideoOfferService],
})
export class VideoOfferComponent {
  sections: VideoSection[] = [];
  selectedVideoId: string | null = null; // Speichert die ID des Videos, das abgespielt werden soll
  isPlayerOpen: boolean = false;

  constructor(private videoOfferService: VideoOfferService) {}

  ngOnInit(): void {
    this.loadSections(); // Lade die Daten hier!
  }

  loadSections() {
    this.videoOfferService.getSections().subscribe(
      (data) => {
        this.sections = data;
      },
      (error) => {
        console.error('Fehler beim Laden der Video-Sections:', error);
      }
    );
  }

  getVideoUrlForPlayer(): string | null {
    if (this.selectedVideoId) {
      // Hier rufst du deinen Service auf, um die HLS-Playlist-URL basierend auf der ID zu erhalten
      this.videoOfferService.getVideoUrlById(this.selectedVideoId).subscribe(response => {
        return response.videoUrl;
      });
    }
    return null;
  }

  playVideo(videoId: string) {
    this.selectedVideoId = videoId;
    this.isPlayerOpen = true;
    console.log('Play video requested for ID:', videoId);
  }

  closeVideoPlayer() {
    this.selectedVideoId = null;
    this.isPlayerOpen = false;
  }
}