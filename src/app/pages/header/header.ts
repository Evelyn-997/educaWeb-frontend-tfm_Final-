import { Component } from '@angular/core';
import { MatSidenavContainer } from '@angular/material/sidenav';
import { MatSidenav, MatSidenavContent} from '@angular/material/sidenav';
import { MatNavList} from "@angular/material/list";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIcon } from "@angular/material/icon"
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatSidenavContainer, MatSidenav, MatNavList, MatSidenavContent, MatToolbar, MatIcon,RouterModule,MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header {
   isSidenavOpen = false;

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

}
