import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StudentService } from '../../service/student';
import { MatIconModule } from '@angular/material/icon';


export interface ActivityGrade {
  name: string;
  grade: number;
}

export interface ExamGrades {
  name: string;
  grade: number;
}

export interface StudentProgressResponse {
  gradeAverage: number;
  activityGrades: ActivityGrade[];
  examGrades: ExamGrades[];
}

export type StudentGlobalProgress = {
  [courseId: number]: StudentProgressResponse;
};

type RiskLevel = 'ALTO' | 'MEDIO' | 'BAJO';
@Component({
  selector: 'app-student-progress',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,MatCardModule,MatProgressBarModule, MatIconModule],
  templateUrl: './student-progress.html',
  styleUrls: ['./student-progress.css'],
  standalone: true
})

export class StudentProgress implements OnInit {

  courseIds!: number[];
  courseNames: Record<number, string> = {};
  progressMap!: StudentGlobalProgress;
  loading = true;

  constructor(
    private studentService: StudentService,
    private courseService: StudentService
  ) {}

  ngOnInit(): void {
    // Simular carga de datos
    this.loadProgress();
    this.courseService.getMyCourses().subscribe((courses) => {
      courses.forEach((course) => {
        this.courseNames[course.id] = course.name;
      });
    });

  }

  loadProgress(): void {
    this.studentService.getGlobalProgress().subscribe({
      next: (data) => {
        this.progressMap= data;
        this.courseIds = Object.keys(data).map(Number);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el progreso del curso:', error);
        this.loading = false;
      },
    });
  }
  //Añadimos indicadores de riesgo
  getRiskLevel(average: number): RiskLevel {
    if (average < 5) return 'ALTO';
    if (average < 7) return 'MEDIO';
    return 'BAJO';
  }
  getRiskLabel(average: number): string {
    switch (this.getRiskLevel(average)) {
      case 'ALTO': return '⚠️ Riesgo alto';
      case 'MEDIO': return '🟡 Riesgo moderado';
      default: return '🟢 Buen progreso';
    }
  }
  getProgressColorClass(average: number): string {
    if (average < 5) return 'danger';
    if (average < 7) return 'warning';
    return 'success';
  }
}
