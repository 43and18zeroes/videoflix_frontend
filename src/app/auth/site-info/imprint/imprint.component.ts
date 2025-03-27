import { Component } from '@angular/core';
import { AuthHeaderComponent } from '../../components/auth-header/auth-header.component';
import { AuthFooterComponent } from '../../components/auth-footer/auth-footer.component';

@Component({
  selector: 'app-imprint',
  imports: [AuthHeaderComponent, AuthFooterComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

}
