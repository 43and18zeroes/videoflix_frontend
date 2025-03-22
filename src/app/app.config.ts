import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authRoutes } from './auth/auth-routing.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { VideoOfferComponent } from './protected/video-offer/video-offer.component';
import { AuthGuard } from './protected/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([...routes, ...authRoutes, { path: 'video-offer', component: VideoOfferComponent, canActivate: [AuthGuard] }]),
    provideHttpClient(withFetch()),
  ]
};
