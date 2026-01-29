import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core'; // Removed "Experimental"
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // Updated name
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCharts(withDefaultRegisterables())
  ]
};