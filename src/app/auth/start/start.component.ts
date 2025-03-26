import { Component } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';


@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthHeaderComponent,
    AuthFooterComponent
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  email = '';
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  showPopup = false;

  constructor(private authService: AuthService) { }

  submitEmail() {
    this.authService.registerUser(this.email).subscribe(
      response => {
        console.log('Registration successful', response);
        this.showPopup = true;
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }

  closePopup() {
    this.showPopup = false;
  }
}
