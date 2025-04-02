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
  loginError = false;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  emailError = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.validateEmail(this.credentials.email)) {
      this.emailError = true;
      return;
    }

    this.authService.login(this.credentials).subscribe(
      (response) => {
        this.authService.setTokens(response);
        this.router.navigate(['/video-offer']);
        this.loginError = false;
      },
      (error) => {
        console.error('Login failed:', error);
        this.loginError = true;
      }
    );
  }

  validateEmail(email: string): boolean {
    const regex = new RegExp(this.emailPattern);
    return regex.test(email);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToSignUp() {
    this.router.navigate(['/start']);
  }
}
