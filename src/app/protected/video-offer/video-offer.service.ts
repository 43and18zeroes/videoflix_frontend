import { HttpClient, HttpHeaders } from '@angular/common/http';
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

interface VideoUrls {
  '480p'?: string;
  '720p'?: string;
  '1080p'?: string;
  original?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VideoOfferService {
  // private apiUrl = 'http://127.0.0.1:8000/api/';
  private apiUrl = 'https://videoflix-backend.cw-coding.de/api/';
  private authTokenKey = 'access_token';


  constructor(private http: HttpClient) {}

  getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  getHeaders(): HttpHeaders {
    const authToken = this.getAuthToken();
    let headers = new HttpHeaders();
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  }

  getSections(): Observable<VideoSection[]> {
    return this.http.get<VideoSection[]>(`${this.apiUrl}videos/`, { headers: this.getHeaders() });
  }

  getVideoUrlsById(videoId: string): Observable<VideoUrls> {
    return this.http.get<VideoUrls>(`${this.apiUrl}videos/${videoId}/urls/`, { headers: this.getHeaders() });
  }

  getVideoHlsUrl(videoId: string): Observable<{ videoUrl: string }> {
    return this.http.get<{ videoUrl: string }>(
      `${this.apiUrl}videos/${videoId}/play/`,
      { headers: this.getHeaders() }
    );
  }

}

