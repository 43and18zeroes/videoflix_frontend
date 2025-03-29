import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private router: Router) {}
  
  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToSignUp() {
    this.router.navigate(['/start']);
  }
}
