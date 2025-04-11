import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-protected-footer',
  imports: [],
  templateUrl: './protected-footer.component.html',
  styleUrl: './protected-footer.component.scss'
})
export class ProtectedFooterComponent {
  constructor(private router: Router) {}
  navigateToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  navigateToImprint() {
    this.router.navigate(['/imprint']);
  }
}
