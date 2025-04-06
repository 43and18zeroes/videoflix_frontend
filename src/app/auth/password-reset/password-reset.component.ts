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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  imports: [
    AuthHeaderComponent,
    AuthFooterComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingOverlayComponent,
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
  uid = '';
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

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.uid = params['uid'];
      this.token = params['token'];
      console.log('UID from URL:', this.uid);
      console.log('Token from URL:', this.token);
    });
  }

  resetPW() {
    this.resetPasswordForm.markAllAsTouched();
    this.resetPasswordForm.updateValueAndValidity();
    if (this.resetPasswordForm.valid && this.uid && this.token) {
      const password = this.resetPasswordForm.value.password;
      this.loading = true;
      this.authService.resetPasswordConfirm(this.uid, this.token, password)
        .subscribe(
          (response) => {
            this.loading = false;
            this.router.navigate(['/video-offer']);
            console.log('The password has been successfully reset.');
          },
          (error) => {
            this.loading = false;
            console.error('Error when resetting the password:', error);
          }
        );
    } else {
      console.error('Form is invalid or UID/token is missing.');
    }
  }
}
