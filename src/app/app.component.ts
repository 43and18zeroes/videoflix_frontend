import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceService } from './auth/services/device/device.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private deviceService: DeviceService) {}
  title = 'videoflix_frontend';
}
