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
    // Lese Query-Parameter beim Initialisieren der Komponente
    this.route.queryParams.subscribe((params) => {
      const emailFromQuery = params['email']; // Hole den 'email'-Parameter
      if (emailFromQuery) {
        this.credentials.email = emailFromQuery; // Setze die E-Mail im Formular
        // Optional: Fokus auf das Passwortfeld setzen
        // const passwordInput = document.getElementById('password');
        // if (passwordInput) {
        //   passwordInput.focus();
        // }
      }
    });
  }

  login(): void {
    this.emailError = false; // Reset email error
    this.loginError = false; // Reset login error
    this.loading = true; // Start loading

    if (!this.validateEmail(this.credentials.email)) {
      this.emailError = true;
      this.loading = false; // Stop loading
      return;
    }

    this.authService.login(this.credentials).subscribe({
      // Verwende Objekt-Format
      next: (response) => {
        this.loading = false; // Stop loading
        this.authService.setTokens(response);
        this.router.navigate(['/video-offer']); // Oder wohin auch immer nach dem Login
        // loginError bleibt false
      },
      error: (error) => {
        this.loading = false; // Stop loading
        console.error('Login failed:', error);
        this.loginError = true; // Zeige Login-Fehler an
        // Optional: Unterscheiden, ob es ein 401 (falsches Passwort) oder anderer Fehler ist
      },
    });
  }

  validateEmail(email: string): boolean {
    if (!email) return false; // Handle empty email case
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
