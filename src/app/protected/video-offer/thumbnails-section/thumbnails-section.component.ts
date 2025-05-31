import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgFor } from '@angular/common';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

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

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiperInstance: Swiper | null = null;

  ngAfterViewInit(): void {
    if (this.swiperContainer && this.swiperContainer.nativeElement) {
      this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
        modules: [Navigation],
        slidesPerView: 4,
        slidesPerGroup: 4,
        spaceBetween: 28,
        loop: false,
        pagination: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          320: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 28,
          },
        },
      });
    } else {
      console.error('Swiper container not found!');
    }
  }

  ngOnDestroy(): void {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  playVideo(videoId: string) {
    this.playVideoEvent.emit(videoId);
  }
}
