import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  imports: [NgFor],
  templateUrl: './thumbnails-section.component.html',
  styleUrl: './thumbnails-section.component.scss',
})
export class ThumbnailsSectionComponent {
  @Input() section!: VideoSection;
  @Output() playVideoEvent = new EventEmitter<string>();

  playVideo(videoId: string) {
    this.playVideoEvent.emit(videoId);
  }
}
