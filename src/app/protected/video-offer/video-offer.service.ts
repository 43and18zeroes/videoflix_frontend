import { Injectable } from '@angular/core';

interface ThumbnailData {
  thumbnailUrl: string;
  videoId: string;
  altText?: string;
}

interface VideoSection {
  title: string;
  thumbnails: ThumbnailData[];
}

@Injectable({
  providedIn: 'root',
})
export class VideoOfferService {
  readonly thumbnailBasePath = 'assets/img/video-offer/videos_thumbnails/';

  getSections(): VideoSection[] {
    return [
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
  }
}