import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Header } from '../../../pages/header/header';
import { AuthService } from '../../service/auth';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})

export class ResetPassword implements OnInit {

  resetForm!: FormGroup;
  token!: string;

  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.errorMessage = 'Token inválido o ausente.';
      return;
    }

    this.resetForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.invalid) {return;}

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      token: this.token,
      newPassword: this.resetForm.value.password
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.successMessage = '✅ Contraseña actualizada correctamente';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.errorMessage = '❌ El enlace no es válido o ha caducado';
        this.loading = false;
      }
    });
  }
}

