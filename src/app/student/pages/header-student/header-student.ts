import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/auth';
import { NotificationService } from '../../../core/notification/notification';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from "@angular/material/list";

@Component({
  selector: 'app-header-student',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatNavList, MatSidenavContainer, MatSidenavContent],
  templateUrl: './header-student.html',
  styleUrls: ['./header-student.css'],
  standalone: true
})
export class HeaderStudent {
  studentName: string = '';
  unreadCount = 0;
  isSidenavOpen = false;
 @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notifyService: NotificationService
  ) {
  }

  ngOnInit(){
    this.studentName = localStorage.getItem('name') || '';

    this.notifyService.notifications$.subscribe(list => {
      this.unreadCount = list.filter(n => !n.read).length;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav() {
   this.sidenav.toggle();

  }
  closeSidenav() {
    this.sidenav.close();
  }
}
