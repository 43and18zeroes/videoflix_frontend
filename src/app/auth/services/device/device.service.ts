import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private renderer: Renderer2;
  isAndroid: boolean = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isAndroid = /Android/i.test(navigator.userAgent);

    if (this.isAndroid) {
      this.applyAndroidClassToFooter();
    }
  }

  private applyAndroidClassToFooter(): void {
    const footer = document.querySelector('footer');
    if (footer) {
      this.renderer.addClass(footer, 'android__footer');
    }
  }
}