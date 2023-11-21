import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-aut-landing',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule
  ],
  templateUrl: './aut-landing.component.html'
})
export class AutLandingComponent {

  constructor(
    private authService: AuthService
  ) { }

  microsoftAuth() {
    this.authService.microsoftAuth();
  }

  googleAuth() {
    this.authService.googleAuth();
  }
}
