import { Component } from '@angular/core';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';
import { NgFor } from '@angular/common';

interface ThumbnailData {
  thumbnailUrl: string; // Pfad zum Vorschaubild
  videoId: string;      // Eindeutiger Identifikator für das Video (z.B. ID, Dateiname, API-Pfad)
  altText?: string;     // Optional: Spezifischer Alt-Text für das Thumbnail
}

// Interface für eine Sektion (Titel + Liste von Thumbnail-Daten)
interface VideoSection {
  title: string;
  thumbnails: ThumbnailData[]; // Array von ThumbnailData-Objekten
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
        { thumbnailUrl: 'assets/img/video-offer/videos_thumbnails/bird-324.webp', videoId: 'bird-video-001', altText: 'Thumbnail of bird video' },
        { thumbnailUrl: 'assets/img/video-offer/videos_thumbnails/blue-sky-324.webp', videoId: 'sky-video-456', altText: 'Thumbnail of sky video' }
        // Fügen Sie hier bei Bedarf weitere Thumbnails hinzu
      ],
    },
    {
      title: 'Documentary',
      thumbnails: [
        { thumbnailUrl: 'assets/img/video-offer/videos_thumbnails/boats-324.webp', videoId: 'boats-doc-789' }, // Alt-Text ist optional
        { thumbnailUrl: 'assets/img/video-offer/videos_thumbnails/campfire-324.webp', videoId: 'campfire-doc-101' }
        // Fügen Sie hier bei Bedarf weitere Thumbnails hinzu
      ],
    },
    // Fügen Sie hier bei Bedarf weitere Sektionen hinzu
  ];


  playVideo(videoId: string) {
    console.log('Play video requested for ID:', videoId);

    // --- HIER kommt Ihre Logik zum Abspielen des Videos ---
    // Dies hängt davon ab, wie Ihr Videoplayer oder Backend funktioniert.
    // Beispiele:
    // 1. Einen Service aufrufen:
    //    this.videoPlayerService.loadAndPlay(videoId);
    // 2. Ein Event an eine übergeordnete Komponente senden:
    //    this.playVideoRequest.emit(videoId);
    // 3. Eine Backend-API aufrufen, um die Video-URL zu erhalten:
    //    this.backendService.getVideoUrl(videoId).subscribe(url => { /* ... player.src = url ... */ });
    //
    // Ersetzen Sie das console.log durch Ihre tatsächliche Implementierung.
  }
}
