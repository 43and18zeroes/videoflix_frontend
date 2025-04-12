import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { ProtectedFooterComponent } from '../components/protected-footer/protected-footer.component';
import { ThumbnailsSectionComponent } from './thumbnails-section/thumbnails-section.component';

interface ThumbnailData {
  thumbnailUrl: string;
  videoId: string;
  altText?: string;
}

interface VideoSection {
  title: string;
  thumbnails: ThumbnailData[];
}

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [ProtectedHeaderComponent, ProtectedFooterComponent, ThumbnailsSectionComponent, NgFor],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {

  readonly thumbnailBasePath = 'assets/img/video-offer/videos_thumbnails/';

  sections: VideoSection[] = [
    {
      title: 'New on Videoflix',
      thumbnails: [
        { thumbnailUrl: this.thumbnailBasePath + 'bird-324.webp', videoId: 'bird-video-001', altText: 'Thumbnail of bird video' },
        { thumbnailUrl: this.thumbnailBasePath + 'blue-sky-324.webp', videoId: 'sky-video-001', altText: 'Thumbnail of sky video' },
        { thumbnailUrl: this.thumbnailBasePath + 'boats-324.webp', videoId: 'boats-video-001', altText: 'Thumbnail of boats video' },
        { thumbnailUrl: this.thumbnailBasePath + 'campfire-324.webp', videoId: 'campfire-video-001', altText: 'Thumbnail of campfire video' },
        { thumbnailUrl: this.thumbnailBasePath + 'cows-324.webp', videoId: 'cows-video-001', altText: 'Thumbnail of cows video' },
        { thumbnailUrl: this.thumbnailBasePath + 'goat-324.webp', videoId: 'goat-video-001', altText: 'Thumbnail of goat video' },
      ],
    },
    {
      title: 'Documentary',
      thumbnails: [
        { thumbnailUrl: this.thumbnailBasePath + 'gras-324.webp', videoId: 'gras-video-001', altText: 'Thumbnail of gras video' },
        { thumbnailUrl: this.thumbnailBasePath + 'mountain-324.webp', videoId: 'mountain-video-001', altText: 'Thumbnail of mountain video' },
      ],
    },
  ];


  playVideo(videoId: string) {
    console.log('Play video requested for ID:', videoId);
  }
}
