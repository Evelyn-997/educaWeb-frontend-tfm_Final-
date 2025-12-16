import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseService, Student } from '../../service/course';
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-course-student',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,FormsModule,
         MatCard, MatCardTitle, MatTableModule, MatIcon, MatPaginator, MatInputModule],
  templateUrl: './course-student.html',
  styleUrl: './course-student.css',
  standalone:true
})
export class CourseStudent implements OnInit{
  students: Student[]= [];
  courseId!: number ;
  displayedColumns: string[] = ['id', 'studentName', 'email','username','enrollmentNumber','actions'];
  filterValue: string = '';
  dataSource =  new MatTableDataSource<Student>();

   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService
  ) { }

  ngOnInit(): void {
    const idAux = this.route.snapshot.paramMap.get('id');
    if (idAux) {
      this.courseId = Number(idAux);
      this.loadStudents();
    }else{
      console.error('❌ No se recibió el parámetro id en la ruta');
    }
  }

    loadStudents(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.students = course.students;
        console.log('🟢 Estudiantes cargados:', this.students);
      },
      error: (err) => {
        console.error('❌ Error al cargar datos del curso', err);
      }
    });
  }
  /*
  loadStudents(){
    if (!this.courseId || isNaN(this.courseId)) {
    console.error('⚠️ courseId no válido:', this.courseId);
    return;
    }

    this.courseService.getStudentByCourse(this.courseId).subscribe({
        next: (studentD) =>  {
          this.students = studentD;
          this.dataSource.data = this.students;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log('✅ Estudiantes del curso cargados:', this.students);
        },
        error: (err) => console.error('❌ Error al cargar los estudiantes del curso',err)
      });
  }*/
  // 🔹 Eliminar estudiante
  removeStudent(studentId: number): void {
    if (!confirm('¿Seguro que deseas eliminar a este estudiante del curso?')) return;

    this.courseService.removeStudentFromCourse(this.courseId, studentId).subscribe({
      next: () => {
        this.students = this.students.filter((s) => s.id !== studentId);
        this.dataSource.data = this.students;
        console.log('✅ Estudiante eliminado del curso con ID:', studentId);
       // this.snackBar.open('✅ Estudiante eliminado correctamente', '', { duration: 2000 });
      },
      error: (err) => {
        console.error('❌ Error al eliminar el estudiante:', err);
        //this.snackBar.open('❌ No se pudo eliminar el estudiante', '', { duration: 2000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value;
    this.filterValue = filter.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  clearFilter(): void {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

}
