import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://127.0.0.1:8000/api/'; // Ihre Backend-URL


  constructor(private http: HttpClient) {}

  getSections(): Observable<VideoSection[]> {
    return this.http.get<VideoSection[]>(`${this.apiUrl}videos/`);
  }

  getBackgroundVideoUrl(): Observable<{ background_video_url: string }> {
    return this.http.get<{ background_video_url: string }>(`${this.apiUrl}background-video/`);
  }

  // getSections(): VideoSection[] {
  //   return [
  //     {
  //       title: 'New on Videoflix',
  //       thumbnails: [
  //         { thumbnailUrl: this.thumbnailBasePath + 'bees-324.webp', videoId: 'bees-video-001', altText: 'Thumbnail of bees video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'bird-324.webp', videoId: 'bird-video-001', altText: 'Thumbnail of bird video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'blue-sky-324.webp', videoId: 'sky-video-001', altText: 'Thumbnail of sky video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'boats-324.webp', videoId: 'boats-video-001', altText: 'Thumbnail of boats video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'boats-many-324.webp', videoId: 'boats-many-video-001', altText: 'Thumbnail of boats-many video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'buffalos-324.webp', videoId: 'buffalos-video-001', altText: 'Thumbnail of buffalos video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'campfire-324.webp', videoId: 'campfire-video-001', altText: 'Thumbnail of campfire video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'cherry-blossom-324.webp', videoId: 'cherry-blossom-video-001', altText: 'Thumbnail of cherry-blossom video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'chick-324.webp', videoId: 'chick-video-001', altText: 'Thumbnail of chick video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'city-324.webp', videoId: 'city-video-001', altText: 'Thumbnail of city video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'cows-324.webp', videoId: 'cows-video-001', altText: 'Thumbnail of cows video' },
  //       ],
  //     },
  //     {
  //       title: 'Documentary',
  //       thumbnails: [
  //         { thumbnailUrl: this.thumbnailBasePath + 'fog-mountain-324.webp', videoId: 'fog-mountain-video-001', altText: 'Thumbnail of fog-mountain video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'forrest-winter-324.webp', videoId: 'forrest-winter-video-001', altText: 'Thumbnail of forrest-winter video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'goat-324.webp', videoId: 'goat-video-001', altText: 'Thumbnail of goat video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'gras-324.webp', videoId: 'gras-video-001', altText: 'Thumbnail of gras video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'green-gras-324.webp', videoId: 'green-gras-video-001', altText: 'Thumbnail of green-gras video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'hawkbite-324.webp', videoId: 'hawkbite-video-001', altText: 'Thumbnail of hawkbite video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'leafs-324.webp', videoId: 'leafs-video-001', altText: 'Thumbnail of leafs video' },
  //       ],
  //     },
  //     {
  //       title: 'Drama',
  //       thumbnails: [
  //         { thumbnailUrl: this.thumbnailBasePath + 'london-eye-324.webp', videoId: 'london-eye-video-001', altText: 'Thumbnail of london-eye video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'matterhorn-324.webp', videoId: 'matterhorn-video-001', altText: 'Thumbnail of matterhorn video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'mountain-324.webp', videoId: 'mountain-video-001', altText: 'Thumbnail of mountain video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'panda-hero-324.webp', videoId: 'panda-hero-video-001', altText: 'Thumbnail of panda hero video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'rainbow-waterfall-324.webp', videoId: 'rainbow-waterfall-video-001', altText: 'Thumbnail of rainbow-waterfall video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'road-324.webp', videoId: 'road-video-001', altText: 'Thumbnail of road video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'seagull-324.webp', videoId: 'seagull-video-001', altText: 'Thumbnail of seagull video' },
  //       ],
  //     },
  //     {
  //       title: 'Romance',
  //       thumbnails: [
  //         { thumbnailUrl: this.thumbnailBasePath + 'sunflowers-324.webp', videoId: 'sunflower-video-001', altText: 'Thumbnail of sunflower video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'surfing-324.webp', videoId: 'surfing-video-001', altText: 'Thumbnail of surfing video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'traffic-324.webp', videoId: 'traffic-video-001', altText: 'Thumbnail of traffic video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'train-324.webp', videoId: 'train-video-001', altText: 'Thumbnail of train video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'trees-lake-324.webp', videoId: 'trees-lake-video-001', altText: 'Thumbnail of trees-lake video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'trees-winter-324.webp', videoId: 'trees-winter-video-001', altText: 'Thumbnail of trees-winter video' },
  //         { thumbnailUrl: this.thumbnailBasePath + 'waterfall-324.webp', videoId: 'waterfall-video-001', altText: 'Thumbnail of waterfall video' },
  //       ],
  //     },
  //   ];
  // }
}