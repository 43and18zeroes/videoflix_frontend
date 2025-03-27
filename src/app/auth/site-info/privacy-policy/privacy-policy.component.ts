import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../../components/auth-footer/auth-footer.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

}
