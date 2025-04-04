import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-popup',
  imports: [CommonModule],
  templateUrl: './success-popup.component.html',
  styleUrl: './success-popup.component.scss'
})
export class SuccessPopupComponent {
  // Input, um zu steuern, ob das Popup sichtbar ist
  @Input() isVisible: boolean = false;

  // Input für die Nachricht (macht die Komponente wiederverwendbarer)
  @Input() message: string = 'Operation successful!';


  @Input() icon: string = 'check_circle';

  // Output, um das Schließen-Event an die Elternkomponente zu senden
  @Output() closed = new EventEmitter<void>();

  // Methode, die beim Klick auf den Schließen-Button aufgerufen wird
  close() {
    this.closed.emit(); // Sendet das Event nach außen
  }
}
