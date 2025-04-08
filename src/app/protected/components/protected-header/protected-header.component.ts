import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-protected-header',
  imports: [],
  templateUrl: './protected-header.component.html',
  styleUrl: './protected-header.component.scss'
})
export class ProtectedHeaderComponent {

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
