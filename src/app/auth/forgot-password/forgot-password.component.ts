import { Component } from '@angular/core';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  loading = false;
  showPopup = false;

  constructor(private authService: AuthService) { }

  sendEmail() {
    this.loading = true;
    this.authService.registerUser(this.email).subscribe(
      response => {
        console.log('Mail sent successful', response);
        this.loading = false;
        this.showPopup = true;
      },
      error => {
        console.error('Registration failed', error);
        this.loading = false;
      }
    );
  }

  closePopup() {
    this.showPopup = false;
  }
}
