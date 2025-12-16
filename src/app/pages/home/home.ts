import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeComponent {
  title = "EDUCA-WEB";
  openMenu = false;

  isSidenavOpen = false;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
