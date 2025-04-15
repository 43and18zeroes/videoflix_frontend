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
    // Initialisiere Swiper, nachdem die View aufgebaut wurde
    if (this.swiperContainer && this.swiperContainer.nativeElement) {
      this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
        // Konfigurationsoptionen
        modules: [Navigation, Pagination], // Module hier übergeben
        slidesPerView: 3, // Zeige 3 Slides gleichzeitig (anpassbar)
        spaceBetween: 28, // Setze den Abstand (wie dein 'gap')
        loop: false, // Ob die Slideshow in einer Schleife laufen soll
        pagination: {
          el: '.swiper-pagination', // Selektor für Paginierungselement
          clickable: true, // Ermöglicht Klick auf Paginierungspunkte
        },
        navigation: {
          nextEl: '.swiper-button-next', // Selektor für nächsten Button
          prevEl: '.swiper-button-prev', // Selektor für vorherigen Button
        },
        // Breakpoints für responsives Verhalten (Beispiel)
        breakpoints: {
          // wenn Fensterbreite >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // wenn Fensterbreite >= 768px
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // wenn Fensterbreite >= 1024px
          1024: {
            slidesPerView: 3,
            spaceBetween: 28,
          },
        },
        // Weitere Optionen findest du in der Swiper API Dokumentation:
        // https://swiperjs.com/swiper-api
      });
    } else {
      console.error('Swiper container not found!');
    }
  }

  ngOnDestroy(): void {
    // Zerstöre die Swiper-Instanz, um Speicherlecks zu vermeiden
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  playVideo(videoId: string) {
    this.playVideoEvent.emit(videoId);
  }
}
