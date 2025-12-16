import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../service/course';
import { MatCard, MatCardTitle, MatCardModule } from "@angular/material/card";
import {  MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/service/auth';
import { DocumentService } from '../../service/document';


interface Course {
  id: number;
  name: string;
  description: string;
  code: string;
}
@Component({
  selector: 'app-course-list',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCard, MatCardTitle, MatIcon, MatTableModule,MatCardModule],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css'],
  standalone: true
})
export class CourseList implements OnInit{
  courses:Course[] = [];
  teacherId!: number;
  courseId!: number;

  displayedColumns: string[] = ['name','code','actions'];

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private docService: DocumentService
  ){}

  ngOnInit(): void {
    this.loadCourses();
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

  }

  loadCourses(){
    this.courseService.getAllCourses().subscribe({
      next:(data) =>{
        this.courses = data;
        //console.log('Cursos recibidos del backend:', data);
      },
      error:()=> console.error('Error al cargar los cursos')
    });
  }

  deleteCourse(idCourse: number){
    if(idCourse && confirm('¿Seguro que desear eliminar este curso?')){
      this.courseService.deleteCourses(idCourse).subscribe(() => {
         this.courses = this.courses.filter(c => c.id!== idCourse);
      });
    }
  }

  viewStudents(courseId?:number): void{
    if (!courseId) {
      console.error('⚠️ courseId no válido:', courseId);
      console.log('Course ID recibido en viewStudents:', courseId);
      return;
    }
     this.router.navigate(['/teacher/courses',courseId,'students'])
  }

  /* Navegar al dashboard del curso*/
  goToDashboard(course:Course): void {
    if (!course.id) {
      console.error('⚠️ courseId no válido:', course.id);
      return;
    }
    this.router.navigate(['/teacher/courses', course.id, 'dashboard']);
  }

  /** 🔹 Subida de documentos desde la tarjeta */
  onFileSelected(courseId: number, event: any): void {
    const files: File[] = Array.from(event.target.files);
    if (!files.length) return;

    const username = this.authService.getUserFromToken().username;

    this.docService.uploadFiles(courseId, files, username).subscribe({
      next: (progress) => {
        if (progress === 100) {
          alert(`📤 Documentos subidos correctamente al curso ${courseId}`);
        }
      },
      error: (err) => {
        console.error('❌ Error al subir documentos', err);
        alert('Error al subir los archivos.');
      }
    });
  }
}
