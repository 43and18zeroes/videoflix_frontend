import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { LoadingOverlayComponent } from '../../global-components/loading-overlay/loading-overlay.component';
import { SuccessPopupComponent } from '../../global-components/success-popup/success-popup.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthHeaderComponent,
    AuthFooterComponent,
    LoadingOverlayComponent,
    SuccessPopupComponent,
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  email = '';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  loading = false;
  showPopup = false;

  constructor(private authService: AuthService) {}

  submitEmail() {
    this.loading = true;
    this.authService.registerUser(this.email).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.loading = false;
        this.showPopup = true;
      },
      (error) => {
        console.error('Registration failed', error);
        this.loading = false;
      }
    );
  }

  closePopup() {
    this.showPopup = false;
  }
}
