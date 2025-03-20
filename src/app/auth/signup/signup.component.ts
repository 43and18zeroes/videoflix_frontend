import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [AuthHeaderComponent, AuthFooterComponent, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  // email: string = '';
  
  // submitPasswd() {}
  token = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

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
      },
      error => {
        console.error('Email confirmation failed', error);
      }
    );
  }
}
