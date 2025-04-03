import { Component } from '@angular/core';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  passwordComplexityValidator,
  passwordMatchValidator,
} from '../validators/sign-up-password.validator';
import { LoadingOverlayComponent } from '../../global-components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-password-reset',
  imports: [AuthHeaderComponent, AuthFooterComponent, LoadingOverlayComponent],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  token = '';
  resetPasswordForm: FormGroup;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, passwordComplexityValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  resetPW() {
    this.resetPasswordForm.markAllAsTouched();
    this.resetPasswordForm.updateValueAndValidity();
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.value.password;
      this.authService.setPassword(this.token, password).subscribe(
        (response) => {
          this.router.navigate(['/login']);
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.router.navigate(['/video-offer']);
        },
        (error) => {
          console.log('Password error');
        }
      );
    }
  }
}
