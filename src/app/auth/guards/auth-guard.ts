import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth';

@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    //const token = localStorage.getItem('accessToken');
    if(!this.authService.isLogged()) {
      this.router.navigateByUrl('/home', { replaceUrl: true });;
      return false;
    }
    return true;
  }
}
