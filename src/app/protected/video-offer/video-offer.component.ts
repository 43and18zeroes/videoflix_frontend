import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-offer',
  imports: [],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
