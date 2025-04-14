import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  selector: 'app-thumbnails-section',
  standalone: true,
  imports: [NgFor],
  templateUrl: './thumbnails-section.component.html',
  styleUrl: './thumbnails-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThumbnailsSectionComponent {
  @Input() section!: VideoSection;
  @Output() playVideoEvent = new EventEmitter<string>();

  playVideo(videoId: string) {
    this.playVideoEvent.emit(videoId);
  }
}
