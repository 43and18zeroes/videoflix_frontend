import { Component } from '@angular/core';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { NgFor } from '@angular/common';

interface VideoSection {
  title: string;
  thumbnails: string[];
}

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [ProtectedHeaderComponent, NgFor],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {

  sections: VideoSection[] = [
    {
      title: 'New on Videoflix',
      thumbnails: [
        'assets/img/video-offer/videos_thumbnails/bird-324.webp',
        'assets/img/video-offer/videos_thumbnails/blue-sky-324.webp',
      ],
    },
    {
      title: 'Documentary',
      thumbnails: [
        'assets/img/video-offer/videos_thumbnails/boats-324.webp',
        'assets/img/video-offer/videos_thumbnails/campfire-324.webp',
      ],
    },
  ];


  playVideo() {}
}
