import { Component } from '@angular/core';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';

@Component({
  selector: 'app-password-reset',
  imports: [AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {

}
