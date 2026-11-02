import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // This app uses zone.js (like most existing Angular apps). See the Zone page.
    provideZoneChangeDetection(),
    provideRouter(routes),
  ],
};
