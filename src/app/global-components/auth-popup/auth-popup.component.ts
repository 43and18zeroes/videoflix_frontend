import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth-popup',
  imports: [CommonModule],
  templateUrl: './auth-popup.component.html',
  styleUrl: './auth-popup.component.scss',
})
export class AuthPopupComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Operation successful!';
  @Input() icon: string = 'check_circle';
  @Input() showButton = true;
  @Input() buttonText = 'Close';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
