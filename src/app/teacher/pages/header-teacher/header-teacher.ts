import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from "@angular/material/sidenav";
import {  MatToolbarModule } from "@angular/material/toolbar";

import { AuthService } from '../../../auth/service/auth';
import { NotificationService } from '../../../core/notification/notification';
import { MatNavList } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-header-teacher',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatNavList, MatSidenavContainer, MatSidenavContent],
  templateUrl: './header-teacher.html',
  styleUrl: './header-teacher.css',
  standalone: true
})
export class HeaderTeacher implements OnInit {
  isSidenavOpen = false;
  teacherName: string = '';
  unreadCount =0;
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private authService: AuthService,
    private notifyService: NotificationService

  ) { }

  ngOnInit(){
    this.authService.loggedIn$.subscribe(isLogged => {
      if (!isLogged) {
        this.teacherName = '';
      }
    });

    this.authService.role$.subscribe(role => {
      if (role === 'TEACHER') {
        const user = this.authService.getUserFromToken();
        this.teacherName = user?.name || '';
      }
    });

    this.notifyService.notifications$.subscribe(list => {
      this.unreadCount = list.filter(n => !n.read).length;
    });
  }
  closeSidenav() {
    this.sidenav.close();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
  logout() {
    this.authService.logout();
  }
}
