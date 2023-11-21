import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [
    RouterModule,
    ToolbarModule,
    ButtonModule,
    CommonModule,
    ToastModule
  ],
})
export class LayoutComponent {
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(
    private authService: AuthService
  ) { }

  logout(): void {
    this.authService.logout();
  }

  deleteAccount(): void {
    this.authService.deleteAccount();
  }

  getEmail(): string {
    return this.authService.currentUser?.email!;
  }

}
