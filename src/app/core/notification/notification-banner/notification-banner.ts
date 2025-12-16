import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../notification';
import { Subscription } from 'rxjs';


export interface NotificationData {
  id: number;
  title: string;
  message: string;
  type: string;
  delivered: boolean;
  read: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-notification-banner',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './notification-banner.html',
  styleUrls: ['./notification-banner.css'],
  standalone:true
})
export class NotificationBanner implements OnInit, OnDestroy{

  latest!: NotificationData | null;
  showBanner = false;
  sub!: Subscription;

  constructor(
    private notifService: NotificationService
  ){}

  ngOnInit(){
    this.sub = this.notifService.notifications$.subscribe(list =>{
      const newest = list[0];
      if(newest && !newest.read){
        this.latest = newest;
        this.show();
      }
    });

  }

  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }

  show() {
    this.showBanner = true;
    setTimeout(() => {
      this.showBanner = false;
    }, 2000);  // Ocultar después de 5 segundos
  }

}
