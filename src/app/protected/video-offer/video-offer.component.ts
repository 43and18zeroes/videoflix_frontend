import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { ProtectedFooterComponent } from '../components/protected-footer/protected-footer.component';
import { ThumbnailsSectionComponent } from './thumbnails-section/thumbnails-section.component';
import { VideoOfferService } from './video-offer.service';

interface VideoSection {
  title: string;
  thumbnails: { thumbnailUrl: string; videoId: string; altText?: string }[];
}

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [ProtectedHeaderComponent, ProtectedFooterComponent, ThumbnailsSectionComponent, NgFor],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
  providers: [VideoOfferService],
})
export class VideoOfferComponent {

  sections: VideoSection[] = [];

  constructor(private videoOfferService: VideoOfferService) {}

  ngOnInit(): void {
    this.sections = this.videoOfferService.getSections(); // Lade die Daten hier!
  }

  playVideo(videoId: string) {
    console.log('Play video requested for ID:', videoId);
  }
}
