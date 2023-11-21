import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { GlobalErrorInterceptor } from './app/services/global.error.interceptor';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(APP_ROUTES),
      provideAnimations(),

      provideHttpClient(withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

      importProvidersFrom(
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth())
      ),

      { provide: HTTP_INTERCEPTORS, useClass: GlobalErrorInterceptor, multi: true },
      MessageService

    ]
  })
  .catch(err => console.error(err));
