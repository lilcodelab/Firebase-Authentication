import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthenticatedOnlyGuard } from './services/authenticated.only.guard';
import { UnauthenticatedOnlyGuard } from './services/unauthenticated.only.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./aut-landing/aut-landing.component').then(m => m.AutLandingComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthenticatedOnlyGuard]
      },
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        canActivate: [UnauthenticatedOnlyGuard]
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];
