import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/service/auth';
import { Footer } from './pages/footer/footer';
import { NotificationBanner } from "./core/notification/notification-banner/notification-banner";
import { HeaderStudent } from "./student/pages/header-student/header-student";
import { HeaderTeacher } from "./teacher/pages/header-teacher/header-teacher";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from "./pages/header/header";
import { filter } from 'rxjs';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, NotificationBanner, HeaderStudent,FormsModule,
     HeaderTeacher, CommonModule, ReactiveFormsModule, Header, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {

  protected readonly title ="EDUCA-WEB";
  role: string | null = null;

   constructor(
    private authService: AuthService,
    private router:Router

  ) { }

  ngOnInit() {
     /** Si la app vuelve a cargar, significa REFRESH → no cerrar sesión */
    sessionStorage.setItem('isReloading', 'true');
    //Detectar cambios de ruta para desactivar headers en login/register
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(()=>{
        this.updateRole();
    });
    //Inicilizar el estado al recargar la pagina
    this.updateRole();

  }

  private  updateRole(): void {
    if (this.authService.isLogged()) {
      this.role = this.authService.getUserRole();
    } else {
      this.role = null;
    }
  }
  //Metodos auxiliares
  isStudent(): boolean{
    return this.role === 'STUDENT'
  }
  isTeacher(): boolean{
    return this.role === 'TEACHER'
  }
  isHome(): boolean {
   return this.router.url === '/' || this.router.url.startsWith('/home');
  }
  isLogged(): boolean {
      return this.authService.isLogged();
  }

  /** Se ejecuta al cerrar pestaña o navegador*/
  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    if (this.authService.isLogged()) {
      //this.notifications.disconnect();
      this.authService.logout(true); // cierre silencioso
    }
    // Limpiar marca

  }
}
