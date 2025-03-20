import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, FormsModule, AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {
  email: string = '';

  constructor(private authService: AuthService) { }

  submitEmail() {
    this.authService.registerUser(this.email).subscribe(
      response => {
        console.log('Registration successful', response);
      },
      error => {
        console.error('Registration failed', error);
      }
    );
  }
}
