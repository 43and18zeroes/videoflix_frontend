import { Component } from '@angular/core';
import { ProtectedHeaderComponent } from '../components/protected-header/protected-header.component';

@Component({
  selector: 'app-video-offer',
  standalone: true,
  imports: [ProtectedHeaderComponent],
  templateUrl: './video-offer.component.html',
  styleUrl: './video-offer.component.scss',
})
export class VideoOfferComponent {

}
