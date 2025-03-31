import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [AuthHeaderComponent, AuthFooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  credentials = {
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe(
      (response) => {
        this.authService.setTokens(response);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToSignUp() {
    this.router.navigate(['/start']);
  }
}
