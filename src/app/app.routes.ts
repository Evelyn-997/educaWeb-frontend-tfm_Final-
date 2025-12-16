import { RouterModule, Routes } from '@angular/router';
import { Login } from './auth/components/login/login';
import { Register } from './auth/components/register/register';
import { AccessDenied } from './auth/components/access-denied/access-denied';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home';
import { ForgotPassword } from './auth/components/forgot-password/forgot-password';
import { teacherRoutes } from './teacher/teacher.routes';
import { studentRoutes } from './student/student.routes';
import { NotificationList } from './core/notification/notification-list/notification-list';
import { ResetPassword } from './auth/components/reset-password/reset-password';

export const routes: Routes = [
  {
    path:"",
    title : "Home",
    component: HomeComponent
  },
  {
    path: 'login',
    title: 'Login',
    component: Login
  },
  {
    path: 'register',
    title: 'Register',
   component: Register
  },
  {
    path: 'access-denied',
    title: 'Access Denied',
   component: AccessDenied
  },
  {
    path:'forgot-password',
    title: 'Forgot Password',
    component:ForgotPassword
  },
  {
    path:'reset-password',
    title: 'Forgot Password',
    component: ResetPassword
  },
  {
    path: 'teacher',
    children: teacherRoutes
  },
  {
    path: 'student',
    title: 'STUDENT',
    children: studentRoutes
  },
  {
    path:'notifications',
    title: "Notificaciones",
    component:NotificationList
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}

