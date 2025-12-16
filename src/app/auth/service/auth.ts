import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

// Add the following import or interface definition for LoginRequest
export interface LoginRequest {
  username: string;
  password: string;
}
// Define JwtResponse interface
export interface JwtResponse {
  accessToken: string;
  refreshToken?: string;
  role?: string;
  username?: any;
  enrollmentNumber?: string;
}
// Define RegisterRequest interface
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  name: string;
  lastName:string;
  role: string;
  enrollmentNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl =  'http://localhost:8080/auth';//URL del backend

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: { username: string; password: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials)
    .pipe(tap((response) => {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken || '');
      localStorage.setItem('username', response.username || '');
      localStorage.setItem('role', response.role || '');
      localStorage.setItem('enrollmentNumber', response.enrollmentNumber || '');
      }),
    catchError((error) => {
      let message = 'Error desconocido';
      if (error.status === 403){
        message = 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
      }else if (error.status === 0){
        message = 'No se pudo conectar con el servidor. Por favor, intenta más tarde.';
      }
      return throwError(() => message);

    })
    );
  }
  //Register
  register(data: any): Observable<any> {
    let endpoint = `${this.apiUrl}/register`; // endpoint base
    // Cambiar el endpoint según el rol seleccionado en el formulario
    if (data.role === 'TEACHER') {
      endpoint = `${this.apiUrl}/register-teacher`;
    } else if (data.role === 'STUDENT') {
      endpoint = `${this.apiUrl}/register-student`;
    }

    return this.http.post(endpoint, data);

  }
  //Refresh token
  refreshToken(refreshToken: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/refreshToken`, { refreshToken });
  }
  //Access Token
  accessToken(accessToken: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/accessToken`, { accessToken });
  }
  //Cambiar la contraseña
  changePassword(data:{
    currentPassword:string,newPassword:string}){
      return this.http.put(`${this.apiUrl}/password/change`,data)
    }
  //Recuperar la contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/forgot`, email );
  }
  //Resetear la contraseña
  resetPassword(data:{token: string, newPassword: string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/password/reset`, data);
  }
  //Obtener el rol del usuario desde el token
  getUserRole(): string | null {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
  //Obtener el rol del usuario desde el token y otros datos
  getUserFromToken(): any | null {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return null;
    try {
      // El payload del JWT está en la segunda parte del token, codificada en base64
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
       // Puedes devolver el payload completo o solo los datos relevantes
      return {
        id: payload.id || payload.id_course || null,
        username: payload.sub || payload.username || null,
        name:payload.name || null,
        lasName:payload.lasName || null,
        role: payload.role || null,
        exp: payload.exp ? new Date(payload.exp*1000): null  //Extrae la fecha de expiracion
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
  // Obtener el token de acceso actual
  getToken(): string | null {
    const token = localStorage.getItem('accessToken');
    return token ? token : null;
  }
  getCurrentUser() {
  const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      name: payload.name,
      lasName:payload.lasName,
      role: payload.role
    };
  }
   //LOGOUT
  isLogged():boolean  {
    //localStorage.removeItem('accessToken');
   // localStorage.removeItem('refreshToken');
    return !!localStorage.getItem('accessToken');
  }
  // Verificar si el usuario está autenticado
  logout(silent:boolean=false):void{
    const token = localStorage.getItem('accessToken');

    if (token){
      this.http.post(`${this.apiUrl}/logout`, { token })
          .subscribe({ error: () => {} });
    }
    localStorage.clear();
    sessionStorage.clear();

    if(silent!){
      this.router.navigate(['/login']);
    }

  }
}
