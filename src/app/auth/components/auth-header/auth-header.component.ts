import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.scss',
})
export class AuthHeaderComponent {
  isOnStartPage = false;
  showLoginButton = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateLoginButtonVisibility(event.url);
        this.isOnStartPage = event.url === '/';
      }
    });
  }

  navigateToStart() {
    this.router.navigate(['/']);
  }

  updateLoginButtonVisibility(url: string) {
    this.showLoginButton = !url.startsWith('/login');
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
