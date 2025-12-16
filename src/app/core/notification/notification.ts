import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/service/auth';
import { BehaviorSubject } from 'rxjs';

export interface NotificationData {
  id: number;
  title: string;
  message: string;
  type: string;
  delivered: boolean;
  read: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  private apiUrl = 'http://localhost:8080/notifications';
  private wsUrl = 'ws://localhost:8080/ws/notifications';
  private reconnectTimeout: any;
  private ws!: WebSocket;
  private notifications = new BehaviorSubject<NotificationData[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService

  ){
    this.loadFromLocalStorage();
  }
  //Conectar al WebSocket
  connect(){
    const user = this.auth.getUserFromToken();
    const url = `${this.wsUrl}?userId=${user.id}`;

    this.ws = new WebSocket(url);
  //Abrimos la conexion
    this.ws.onopen = () =>{
      if (this.reconnectTimeout){
        clearTimeout(this.reconnectTimeout);
      }
    }
    //Cuando llegue una notificacion
    this.ws.onmessage = (event) => {
      const msg: NotificationData = JSON.parse(event.data);
      this.notifications.next([msg, ...this.notifications.value]);
    }
    // Error
    this.ws.onerror = (e) => {
      console.error("❌ WebSocket error:", e);
    };
    //Desconectar
    this.ws.onclose = () => {
      console.warn("WS Desconectado");
    this.reconnect();
  }
  }
  /*
  connectToUser(userId: number, onNotification: (n: NotificationData) => void){
    const user = this.auth.getUserFromToken();
    const url = `${this.wsUrl}?userId=${user.id}`;

    this.ws = new WebSocket(url);
  }*/
  //Reconectar automaticamente
  private reconnect(){
    this.reconnectTimeout =setTimeout(()=>{
      this.connect();
    },1000)
  }
  //Enviar una notificacion
  sendNotification(n: NotificationData){
    return this.http.post<NotificationData>(`${this.apiUrl}/send`,n)
  }
  //Desconectar manualmente
  disconnect(){
    if(this.ws){
      this.ws.close();
    }
  }
//Cargar notificaciones pendientes
  loadUnread(){
    return this.http.get<NotificationData[]>(`${this.apiUrl}/unread`).
    subscribe(res =>{
      this.notifications.next(res);
    });
  }
 //Marcar como leida
  markAsRead(id:number){
    return this.http.post(`${this.apiUrl}/${id}/mark-read`,{})
    .subscribe(()=>{
      const update =this.notifications.value.map(n =>
        n.id === id ? { ...n, read:true}: n);
        this.notifications.next(update);
        this.saveToLocalStorage();
      });
  }
  //
  private saveToLocalStorage() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications.value));
  }
  //Cargar notificaciones desde localStorage
  private loadFromLocalStorage() {
    const data = localStorage.getItem('notifications');
    if (data) {
      const parsed = JSON.parse(data);
      this.notifications.next(parsed);
    }
  }

}



