import { Component } from '@angular/core';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { LoadingOverlayComponent } from '../../global-components/loading-overlay/loading-overlay.component';
import { FormsModule } from '@angular/forms';
import { AuthPopupComponent } from '../components/auth-popup/auth-popup.component';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, AuthHeaderComponent, AuthFooterComponent, LoadingOverlayComponent, FormsModule, AuthPopupComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  loading = false;
  showSuccessPopup = false;
  showErrorPopup = false;

  constructor(private authService: AuthService) { }

  sendEmail() {
    this.loading = true;
    this.authService.resetPassword(this.email).subscribe(
      response => {
        console.log('Mail sent successful', response);
        this.loading = false;
        this.showSuccessPopup = true;
        this.showErrorPopup = false;
      },
      error => {
        console.error('Password reset failed', error);
        this.loading = false;
        this.showErrorPopup = true;
        this.showSuccessPopup = false;
      }
    );
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  closeErrorPopup() {
    this.showErrorPopup = false;
  }
}