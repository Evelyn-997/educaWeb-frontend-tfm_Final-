import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationData, NotificationService } from '../notification';

@Component({
  selector: 'app-notification-list',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './notification-list.html',
  styleUrls: ['./notification-list.css'],
  standalone:true
})

export class NotificationList implements OnInit{
  notifications:NotificationData[] =[];
  unreadCount = 0;
  filterType = 'ALL';

  constructor(
    private notifService: NotificationService

  ){}

  ngOnInit(): void {
    // Cargar notificaciones no leídas + suscribirse en tiempo real
    this.notifService.notifications$.subscribe(list => {
      this.notifications = list;
    });
    this.notifService.loadUnread();
  }

  markAsRead(n: NotificationData) {
    if (!n.read) {
      this.notifService.markAsRead(n.id);
    }
  }
  get filteredNotifications() {
  if (this.filterType === 'ALL') return this.notifications;
  return this.notifications.filter(n => n.type === this.filterType);
}


}
