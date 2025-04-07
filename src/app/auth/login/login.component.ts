import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { LoadingOverlayComponent } from '../../global-components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AuthHeaderComponent,
    AuthFooterComponent,
    FormsModule,
    LoadingOverlayComponent,
  ],
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
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const emailFromQuery = params['email'];
      if (emailFromQuery) {
        this.credentials.email = emailFromQuery;
      }
    });
  }

  login(): void {
    this.emailError = false;
    this.loginError = false;
    this.loading = true;

    if (!this.validateEmail(this.credentials.email)) {
      this.emailError = true;
      this.loading = false;
      return;
    }

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.authService.setTokens(response);
        this.router.navigate(['/video-offer']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Login failed:', error);
        this.loginError = true;
      },
    });
  }

  validateEmail(email: string): boolean {
    if (!email) return false;
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
