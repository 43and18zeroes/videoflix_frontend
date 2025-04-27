import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { ProtectedFooterComponent } from '../components/protected-footer/protected-footer.component';
import { ThumbnailsSectionComponent } from './thumbnails-section/thumbnails-section.component';
import { VideoOfferService } from './video-offer.service';
// Importiere die neue VideojsPlayerComponent
import { VideojsPlayerComponent } from '../videojs-player/videojs-player.component';

interface ThumbnailData {
  thumbnailUrl: string;
  videoId: string;
  altText?: string;
}

interface VideoSection {
  title: string;
  thumbnails: ThumbnailData[];
}

interface VideoUrls {
  '480p'?: string;
  '720p'?: string;
  '1080p'?: string;
  original?: string;
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
  selectedVideoId: string | null = null;
  isPlayerOpen: boolean = false;
  videoUrls: VideoUrls = {};

  constructor(private videoOfferService: VideoOfferService) {}

  ngOnInit(): void {
    this.loadSections(); // Lade die Daten hier!
    this.playVideo('16');
  }

  ngOnDestroy(): void {
    this.closeVideoPlayer();
  }

  loadSections() {
    this.videoOfferService.getSections().subscribe(
      (data: any[]) => {
        console.log('Raw data from backend:', data);
  
        // Gruppiere die Videos nach Kategorie
        const sectionsMap = new Map<string, ThumbnailData[]>();
  
        data.forEach(video => {
          const category = video.category || 'Other';
  
          if (!sectionsMap.has(category)) {
            sectionsMap.set(category, []);
          }
  
          sectionsMap.get(category)!.push({
            thumbnailUrl: video.thumbnail,
            videoId: video.id.toString(),  // video.id als String
            altText: video.title
          });
        });
  
        // Konvertiere die Map in ein Array von VideoSections
        this.sections = Array.from(sectionsMap.entries()).map(([category, thumbnails]) => ({
          title: category, 
          thumbnails: thumbnails
        }));
  
        console.log('Transformed sections:', this.sections);
      },
      (error) => {
        console.error('Fehler beim Laden der Video-Sections:', error);
      }
    );
  }
  

  // getVideoUrlForPlayer(): string | null {
  //   if (this.selectedVideoId) {
  //     // Hier rufst du deinen Service auf, um die HLS-Playlist-URL basierend auf der ID zu erhalten
  //     this.videoOfferService.getVideoUrlById(this.selectedVideoId).subscribe(response => {
  //       return response.videoUrl;
  //     });
  //   }
  //   return null;
  // }

  playVideo(videoId: string) {
    this.selectedVideoId = videoId;
    this.videoOfferService.getVideoUrlsById(this.selectedVideoId).subscribe(
      (response) => {
        this.videoUrls = response;
        this.isPlayerOpen = true;
        console.log('Video URLs:', this.videoUrls);
      },
      (error) => {
        console.error('Fehler beim Abrufen der Video-URLs:', error);
        this.isPlayerOpen = false;
      }
    );
  }

  closeVideoPlayer() {
    this.selectedVideoId = null;
    this.videoUrls = {};
    this.isPlayerOpen = false;
  }
}