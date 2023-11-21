import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AuthTestDto } from '../models/AuthTestDto';
import { HomeService } from '../services/home.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    ButtonModule,
    CommonModule,
    DividerModule
  ]
})
export class HomeComponent {
  authTest!: AuthTestDto;

  constructor(
    private homeService: HomeService
  ) { }

  liveDemo() {
    this.homeService.getAll().subscribe(authTest => {
      this.authTest = authTest;
    });
  }

}
