
import { Routes } from '@angular/router';
import { CourseForm } from './component/course-form/course-form';
import { CourseList } from './component/course-list/course-list';
import { CourseStudent } from './component/course-student/course-student';

import { CourseEdit } from './component/course-edit/course-edit';
import { AddStudent } from './component/add-student/add-student';
import { AuthGuard } from '../auth/guards/auth-guard';
import { RoleGuard } from '../auth/guards/role-guard';
import { TeacherDocuments } from './component/teacher-documents/teacher-documents';
import { CourseDashboard } from './pages/course-dashboard/course-dashboard';
import { ProfileComponent } from '../auth/components/profile/profile';


export const teacherRoutes: Routes =[
  {
    path:'',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['TEACHER'] },
    children:[
      {
        path:'',
        title: 'Panel de Profesor',
        component: CourseList
      },
      {
        path:'courses',
        title: 'Cursos',
        component: CourseList
      },
      {
        path:'courses/new',
        title: 'Formulario de Cursos',
        component: CourseForm
      },
      {
        path:'courses/:id/students',
        title: 'Estudiantes del Curso',
        component: CourseStudent
      },
      {
        path:'courses/edit/:id_course',
        title: 'Editar curso',
        component: CourseEdit
      },
      {
        path: 'courses/:id/add-student',
        title: 'Añadir Alumno a Curso',
        component: AddStudent
      },
      {
        path: 'courses/:id_course/documents',
        title: 'Documentos del Profesor',
        component: TeacherDocuments
      },
      {
        path:'courses/:id/dashboard',
        title: 'Panel del Curso',
        component: CourseDashboard
      },
      {
        path:'profile',
        title: 'Perfil',
        component: ProfileComponent
      }


    ]
  }

];
