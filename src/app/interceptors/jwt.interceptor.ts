import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor,  HttpInterceptorFn,  HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../auth/service/auth";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const publicUrls = [
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/auth/logout',
      '/auth/password/forgot',
      '/auth/password/reset'
    ];

    const accessToken = localStorage.getItem('accessToken');

    let authReq = req;
    // No añadir token en las URLs publicas
    if (publicUrls.some(url => req.url.includes(url))) {
      return next.handle(req);
    }
    //Clona el request y añade el encabezado AUthorization si hay token
    if (accessToken) {
      //Para mayor robustez
      authReq = req.clone({
        setHeaders:{ Authorization: `Bearer ${accessToken}` }
      });
    }
    //Manejo de errores y expiracion de token se puede hacer aqui
    return next.handle(authReq).pipe(
      catchError((error:HttpErrorResponse) => {
        //Si el Token Expiro o es invalido
        if (error.status === 401) {
          //SI YA SE HA HECHO LOGOUT → NO REFRESH
          if (!this.authService.canRefresh()) {
            this.authService.logout(true);
            return throwError(() => error);
          }
          //Redirigir al login si el token ha expirado o es invalido
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            //Intentar refrescar el token
            return this.authService.refreshToken(refreshToken).pipe(
              switchMap((res:any) => {
                //Guardar los nuevos tokens en el localStorage
                localStorage.setItem('accessToken', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);

                //Reintentar la solicitud original con el nuevo token
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                });
                return next.handle(retryReq);
              }),
              catchError(() => {
                //Si el refresh falla -> cerrar sesion
                this.authService.logout(true);
                this.router.navigate(['/login']);
                return throwError(() => new Error('Session expired. Please log in again.'));
              })
            );
          } else {
            //No hay refresh token -> cerrar sesion
            this.authService.logout(true);
            this.router.navigate(['/']);
          }
        }
        //Propagar otros errores
        return throwError(() => error);
        })
      );
  }

}

export const jwtInterceptor:HttpInterceptorFn = (req, next) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
      //Para mayor robustez
      req = req.clone({
        setHeaders:{ Authorization: `Bearer ${accessToken}` }
      });
    }
    return next(req); //(Robustez)

}
