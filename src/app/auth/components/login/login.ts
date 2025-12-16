import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Update the path below to the correct relative path where auth.service.ts exists
import { AuthService } from '../../service/auth';
import { Header } from "../../../pages/header/header";
import { NotificationService } from '../../../core/notification/notification';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, Header, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class Login implements OnInit{
  loginForm !: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
     this.loading = true;
     this.errorMessage = '';

     this.authService.login(this.loginForm.value).subscribe({
       next: (res:any) => {
        console.log('✅ Login correcto:', res);
        //Guardamos los tokens en el localStorage
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('role', res.role);
        localStorage.setItem('name', res.name);

        //INICIALIZAR NOTIFICACIONES AQUÍ
        this.notificationService.connect();
        this.notificationService.loadUnread();

         //Redigirimos segun el rol
          if (res.role === 'TEACHER') {
            this.router.navigate(['/teacher']);
          } else if (res.role === 'STUDENT') {
            this.router.navigate(['/student']);
          }else{
            this.router.navigate(['/']);
          };
        },
        error: (err) => {
          this.errorMessage = err;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
}

