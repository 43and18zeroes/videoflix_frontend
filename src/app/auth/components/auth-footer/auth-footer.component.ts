import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-footer',
  standalone: true,
  imports: [],
  templateUrl: './auth-footer.component.html',
  styleUrl: './auth-footer.component.scss',
})
export class AuthFooterComponent {
  constructor(private router: Router) {}
  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  navigateToImprint() {
    this.router.navigate(['/imprint']);
  }
}
