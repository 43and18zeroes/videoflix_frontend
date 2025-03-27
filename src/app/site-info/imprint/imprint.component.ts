import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../auth/components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../../auth/components/auth-footer/auth-footer.component';

@Component({
  selector: 'app-imprint',
  imports: [AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

}
