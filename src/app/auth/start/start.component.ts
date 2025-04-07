import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { LoadingOverlayComponent } from '../../global-components/loading-overlay/loading-overlay.component';
import { SuccessPopupComponent } from '../../global-components/success-popup/success-popup.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  submitEmail() {
    this.loading = true;
    this.errorMessage = null;
    this.authService.registerUser(this.email).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.loading = false;
        this.showPopup = true;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Registration failed', error);
        if (
          error.status === 400 &&
          error.error?.email?.[0]?.includes('already exists')
        ) {
          this.router.navigate(['/login'], {
            queryParams: { email: this.email },
          });
        } else {
          this.errorMessage =
            error.error?.detail ||
            'An unexpected error occurred during registration.';
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  closePopup() {
    this.showPopup = false;
  }
}
