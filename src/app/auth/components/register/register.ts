import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService} from '../../service/auth';
import { CommonModule } from '@angular/common';
import { Header } from "../../../pages/header/header";


@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, Header,RouterModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: true
})
export class Register {

  registerForm !: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  enrollmentNumber: string | null = null; //* Campo para Nº de matrícula
  role: string | null=null; //* Campo para el rol seleccionado */

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
    name:['',Validators.required],
    lastName:['',Validators.required],
    username: ['',[Validators.required, Validators.minLength(3)]],
    email: ['',[Validators.required, Validators.email]],
    password: ['',[
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
    role: ['STUDENT', [Validators.required]] //Valor por defecto
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.registerForm.value;

    this.auth.register(formValue).subscribe({
      next: () => {
        //Redigir segun el rol
        if(formValue.role === 'TEACHER'){
          this.successMessage = 'Teacher registration successful! Redirecting to login...';
          this.router.navigate(['/teacher-dashboard']);
        } else if(formValue.role === 'STUDENT'){
          this.successMessage = 'Student registration successful! Redirecting to login...';
          this.router.navigate(['/student-dashboard']);
        }

        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Please try again.';
        console.log(err);
        console.log('Error', this.errorMessage);
      },
      complete: () => {
        this.loading = false;
      }
    });
    }


}

