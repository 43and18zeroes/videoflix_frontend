import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [AuthHeaderComponent, AuthFooterComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  token = '';
  setPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showPasswordForm: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.setPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.confirmEmail();
    });
  }

  confirmEmail() {
    this.authService.confirmEmail(this.token).subscribe(
      response => {
        console.log('Email confirmed', response);
        this.successMessage = 'Email confirmed';
        this.showPasswordForm = true;
      },
      error => {
        console.error('Email confirmation failed', error);
        this.errorMessage = 'Email confirmation failed';
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.setPasswordForm.valid) {
      const password = this.setPasswordForm.value.password;
      this.authService.setPassword(this.token, password).subscribe(
        response => {
          this.successMessage = 'Password set successfully';
          this.router.navigate(['/login']);
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.router.navigate(['/video-offer']);
        },
        error => {
          this.errorMessage = 'Password setting failed';
        }
      );
    }
  }
}
