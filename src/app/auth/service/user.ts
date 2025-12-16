import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class UserService {
   private api = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}

  getMyProfile() {
    return this.http.get(`${this.api}/me`);
  }

  updateMyProfile(data: any) {
    return this.http.put(`${this.api}/me`, data);
  }

}
