import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceService } from './services/device/device.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'videoflix_frontend';
  backgroundClass = '';

  constructor(private router: Router, private deviceService: DeviceService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateBackgroundClass(event.url);
      }
    });
  }

  updateBackgroundClass(url: string) {
    if (url === '/') {
      this.backgroundClass = 'start-background';
    } else if (url.startsWith('/signup') || url.startsWith('/forgot-password') || url.startsWith('/login') || url.startsWith('/password-reset')) {
      this.backgroundClass = 'auth-background';
    } else {
      this.backgroundClass = '';
    }
  }
}
