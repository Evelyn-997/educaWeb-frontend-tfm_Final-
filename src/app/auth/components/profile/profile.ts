import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth';
import { UserService } from '../../service/user';
import { MatDivider } from "@angular/material/divider";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import {  MatListItem, MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,
    MatDivider, MatCardModule, MatInputModule, MatListModule, MatIconModule, MatListItem, MatProgressSpinnerModule]
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  role = '';
  loading = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      });

    }

  ngOnInit() {
    this.loadUserInfo();

  }

  loadUserInfo() {
    const tokenData = this.authService.getUserFromToken();
    this.role = tokenData.role;

    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la información del usuario.';
        this.loading = false;
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.userService.updateMyProfile(this.profileForm.value).subscribe({
      next: () => {
        alert('Perfil actualizado correctamente');
      },
      error: () => {
        alert('No se pudo actualizar el perfil. Inténtalo de nuevo.');
      }
    });
  }

  isStudent() { return this.role === 'STUDENT'; }
  isTeacher() { return this.role === 'TEACHER'; }
}
