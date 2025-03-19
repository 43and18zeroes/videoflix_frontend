import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-signup',
  imports: [AuthHeaderComponent, AuthFooterComponent, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  email: string = '';

  submitPasswd() {}

}
