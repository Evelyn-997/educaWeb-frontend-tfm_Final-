import { Component } from '@angular/core';
import { AuthService } from '../../service/auth';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from "../../../pages/header/header";


@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, Header],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
  standalone: true
})
export class ForgotPassword {
  forgotForm !: FormGroup;
  loading = false;
  successMessage= '';
  errorMessage ='';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ){
    this.forgotForm = this.fb.group({
    email:['',[Validators.required, Validators.email ]]
  });
  }

  onSubmit(){
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.successMessage="";
    this.errorMessage = "";
    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: ()=>{
        console.log("email Intorducido: ", email );
        this.successMessage = "📩 Se ha enviado un enlace de recuperación a tu correo electrónico.";
        this.loading = false;
      },
      error:(err)=>{
        console.log("email Intorducido: ", email );
        console.error(err);
        this.errorMessage = "❌ Error al enviar el correo. Verifica tu dirección o inténtalo más tarde.";
        this.loading = false;
      },
      /*complete: () =>{
        this.loading = true;
      }*/
    });
  }
}
