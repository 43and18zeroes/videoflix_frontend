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
    this.errorMessage = null; // Reset error message
    this.authService.registerUser(this.email).subscribe({
      // Verwende das Objekt-Format für subscribe
      next: (response) => {
        console.log('Registration successful', response);
        this.loading = false;
        this.showPopup = true; // Zeige Popup für *neue* Registrierung
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.error('Registration failed', error);

        // --- HIER IST DIE LOGIK ---
        // Prüfe, ob der Fehler ein 400er ist und ob die Fehlermeldung auf einen existierenden User hindeutet
        // Passe die Bedingung an die *exakte* Fehlermeldung deines Backends an!
        // Beispiel Annahme: Backend sendet { "email": ["user with this email already exists."] }
        if (
          error.status === 400 &&
          error.error?.email?.[0]?.includes('already exists')
        ) {
          // Sicherer Zugriff mit '?'
          // E-Mail existiert bereits -> Weiterleiten zum Login mit E-Mail als Query Parameter
          this.router.navigate(['/login'], {
            queryParams: { email: this.email },
          });
        } else {
          // Anderer Fehler (z.B. Server down, Validierungsfehler etc.)
          // Setze eine generische Fehlermeldung oder zeige die Backend-Meldung an
          this.errorMessage =
            error.error?.detail ||
            'An unexpected error occurred during registration.';
          // Du könntest hier auch ein Error-Popup anzeigen
        }
        // --- ENDE DER LOGIK ---
      },
      complete: () => {
        // Wird nach next oder error aufgerufen (wenn observable komplettiert), hier nicht zwingend nötig
        this.loading = false; // Sicherstellen, dass Loading immer endet
      },
    });
  }

  closePopup() {
    this.showPopup = false;
  }
}
