import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { ProtectedFooterComponent } from '../components/protected-footer/protected-footer.component';
import { ThumbnailsSectionComponent } from './thumbnails-section/thumbnails-section.component';
import { VideoOfferService } from './video-offer.service';
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
  videoUrl: string = '';

  constructor(private videoOfferService: VideoOfferService) {}

  ngOnInit(): void {
    this.loadSections();
    // this.playVideo('16');
  }

  ngOnDestroy(): void {
    this.closeVideoPlayer();
  }

  loadSections() {
    this.videoOfferService.getSections().subscribe(
      (data: any[]) => {
        const sectionsMap = new Map<string, ThumbnailData[]>();
  
        data.forEach(video => {
          const category = video.category || 'Other';
  
          if (!sectionsMap.has(category)) {
            sectionsMap.set(category, []);
          }
  
          sectionsMap.get(category)!.push({
            thumbnailUrl: video.thumbnail,
            videoId: video.id.toString(),
            altText: video.title
          });
        });
  
        this.sections = Array.from(sectionsMap.entries()).map(([category, thumbnails]) => ({
          title: category, 
          thumbnails: thumbnails
        }));
      },
      (error) => {
        console.error('Fehler beim Laden der Video-Sections:', error);
      }
    );
  }

  playVideo(videoId: string) {
    this.selectedVideoId = videoId;
    this.videoOfferService.getVideoHlsUrl(videoId).subscribe(
      (response) => {
        this.videoUrl = response.videoUrl;
        this.isPlayerOpen = true;
      },
      (error) => {
        console.error('Fehler beim Abrufen der HLS-URL:', error);
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