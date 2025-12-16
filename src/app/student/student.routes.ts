import { Routes } from "@angular/router";
import { StudentDashboard } from "./component/student-dashboard/student-dashboard";
import { AuthGuard } from "../auth/guards/auth-guard";
import { RoleGuard } from "../auth/guards/role-guard";
import { StudentCourse } from "./component/student-course/student-course";
import { ProfileComponent } from "../auth/components/profile/profile";
import { StudentProgress } from "./component/student-progress/student-progress";
export const studentRoutes: Routes =[
  {
    path:'',
      canActivate: [AuthGuard, RoleGuard],
      data: { roles: ['STUDENT'] },
      children:[
        {
          path:'',
          title: 'Panel del Estudiante',
          component: StudentDashboard
        },
        {
          path:'courses',
          title: 'Mis cursos',
          component: StudentDashboard
        },
        {
          path:'course/:id',
          title:'Curso ',
          component: StudentCourse
        },
        {
        path:'profile',
        title: 'Perfil',
        component: ProfileComponent
      },
        {
          path:'progress',
        title:'Mi progreso',
          component: StudentProgress
        },


      ]
    }
];
