import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Course } from '../../../teacher/service/course';
import { StudentService } from '../../service/student';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule,MatCardModule],
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
  standalone: true
})
export class StudentDashboard implements OnInit {
  studentName: string = '';
  enrollmentNumber: string = '';

  courses: Course[]= [];
  loading = true;

  constructor(
    private studentService: StudentService,
    private router: Router
  ){}

  ngOnInit() {
    this.studentName = localStorage.getItem('name') || '';
    //this.enrollmentNumber = localStorage.getItem('enrollmentNumber') || '';
    this.loadCourses();

  }
  loadCourses(){
    this.studentService.getMyCourses().subscribe({
      next:(data)=>{
        this.courses =data;
        this.loading = false;
      },
      error:()=>{
        this.loading = false;
      }
    });
  }

  /* Navegar al dashboard del curso*/
  goToDashboard(course:Course): void {
    if (!course.id) {
      console.error('⚠️ courseId no válido:', course.id);
      return;
    }
    this.router.navigate(['/student/course', course.id]);
  }

}
