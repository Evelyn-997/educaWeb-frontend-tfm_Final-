import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth';


@Injectable({
  providedIn: 'root'
})

export class RoleGuard  implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(router: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    const expectedRole = router.data['roles'] as string[];
    const userRole = this.authService.getUserRole(); // Implementa este método en tu servicio Auth
    //Si no hay sesion
    if(!userRole){
      this.router.navigate(['/login']);
      return false;
    }
    //Si el rol del usuario no coincide con el esperado
    if(!expectedRole.includes(userRole)){
      this.router.navigate(['/access-dennied']); // Redirige a una página de acceso no autorizado
      return false;
    }
    return true;
  }
}
