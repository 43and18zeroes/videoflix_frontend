import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private renderer: Renderer2;
  isAndroid: boolean = false;
  isiPhone: boolean = false;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);

    if (isPlatformBrowser(this.platformId)) {
      const userAgent = navigator.userAgent;
      this.isAndroid = /Android/i.test(userAgent);
      this.isiPhone = /iPhone|iPad|iPod/i.test(userAgent) || /iOS/i.test(userAgent);

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.applyDeviceClassToFooter();
      });

      this.applyDeviceClassToFooter();
    }
  }

  private applyDeviceClassToFooter(): void {
    const authFooter = document.querySelector('app-auth-footer');
    const protectedFooter = document.querySelector('app-protected-footer');
    if (authFooter) {
      if (this.isAndroid) {
        this.renderer.addClass(authFooter, 'android__footer');
      }
      if (this.isiPhone) {
        this.renderer.addClass(authFooter, 'iphone__footer');
      }
    }
    if (protectedFooter) {
      if (this.isAndroid) {
        this.renderer.addClass(protectedFooter, 'android__footer');
      }
      if (this.isiPhone) {
        this.renderer.addClass(protectedFooter, 'iphone__footer');
      }
    }
  }
}