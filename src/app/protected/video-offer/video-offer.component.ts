import { Component } from '@angular/core';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { NgFor } from '@angular/common';

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
  imports: [ProtectedHeaderComponent, NgFor],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {

  readonly thumbnailBasePath = 'assets/img/video-offer/videos_thumbnails/';

  sections: VideoSection[] = [
    {
      title: 'New on Videoflix',
      thumbnails: [
        { thumbnailUrl: `${this.thumbnailBasePath}bird-324.webp`, videoId: 'bird-video-001', altText: 'Thumbnail of bird video' },
        { thumbnailUrl: `${this.thumbnailBasePath}blue-sky-324.webp`, videoId: 'sky-video-456', altText: 'Thumbnail of sky video' }
      ],
    },
    {
      title: 'Documentary',
      thumbnails: [
        { thumbnailUrl: this.thumbnailBasePath + 'boats-324.webp', videoId: 'boats-doc-789' },
        { thumbnailUrl: this.thumbnailBasePath + 'campfire-324.webp', videoId: 'campfire-doc-101' }
      ],
    },
  ];


  playVideo(videoId: string) {
    console.log('Play video requested for ID:', videoId);
  }
}
