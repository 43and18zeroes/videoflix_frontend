import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  passwordComplexityValidator,
  passwordMatchValidator,
} from '../validators/sign-up-password.validator';

@Component({
  selector: 'app-sign-up',
  imports: [
    AuthHeaderComponent,
    AuthFooterComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  token = '';
  setPasswordForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.setPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, passwordComplexityValidator]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onSubmit() {
    this.setPasswordForm.markAllAsTouched();
    this.setPasswordForm.updateValueAndValidity();
    if (this.setPasswordForm.valid) {
      const password = this.setPasswordForm.value.password;
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
