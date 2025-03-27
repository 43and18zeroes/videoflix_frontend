import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../auth/components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../../auth/components/auth-footer/auth-footer.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

}
