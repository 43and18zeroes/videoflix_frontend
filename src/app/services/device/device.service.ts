import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private renderer: Renderer2;
  isAndroid: boolean = false;
  isiPhone: boolean = false;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    if (isPlatformBrowser(this.platformId)) {
      const userAgent = navigator.userAgent;
      this.isAndroid = /Android/i.test(userAgent);
      this.isiPhone = /iPhone|iPad|iPod/i.test(userAgent) || /iOS/i.test(userAgent);

      window.addEventListener('load', () => { // verwendet window.onload
        this.applyDeviceClassToFooter();
      });
    }
  }

  private applyDeviceClassToFooter(): void {
    const footer = document.querySelector('app-auth-footer');
    if (footer) {
      if (this.isAndroid) {
        this.renderer.addClass(footer, 'android__footer');
      }
      if (this.isiPhone) {
        this.renderer.addClass(footer, 'iphone__footer');
      }
    }
  }
}