import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private renderer: Renderer2;
  isAndroid: boolean = false;
  isiPhone: boolean = false;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object // Überprüft, ob es der Browser ist
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    // Prüfen, ob der Code im Browser läuft
    if (isPlatformBrowser(this.platformId)) {
      this.isAndroid = /Android/i.test(navigator.userAgent);
      this.isiPhone = /iPhone|iPod/i.test(navigator.userAgent);

      this.applyDeviceClassToFooter();
    }
  }

  private applyDeviceClassToFooter(): void {
    if (isPlatformBrowser(this.platformId)) {
      const footer = document.querySelector('footer');

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
}