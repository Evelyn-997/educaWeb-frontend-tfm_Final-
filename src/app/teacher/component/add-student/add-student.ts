import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course, CourseService } from '../../service/course';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-add-student',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule,
            MatTabGroup, MatTabsModule, MatTableModule],
  templateUrl: './add-student.html',
  styleUrls: ['./add-student.css'],
  standalone:true
})
export class AddStudent {
  addForm: FormGroup;
  selectedStudent: any = null;
  alreadyInCourse: boolean = false;
  isTeacher: boolean = false;
  courseId!: number;
  isSearching: boolean = false;
  studentNotFound: boolean = false;
  //courseData!: Course;
  courseData: Course | null = null;
  students: any[] = [];

  constructor(
    private fb:FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ){
    this.addForm =this.fb.group({
      studentId:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id')); // ← Obtiene el curso desde la URL
    this.loadStudents();
  }

  onSearchStudent(): void {
    const studentId = Number(this.addForm.value.studentId);

    if (!studentId) {
      this.resetSearchState();
      return;
    }

    this.isSearching = true;      // ⬅️ Estamos buscando
    this.studentNotFound = false;
    //Obtener datos del estudiante por ID
    this.courseService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.selectedStudent = student;
        //Comprobar si el ID corresponde a un profesor
        this.isTeacher = student.role === 'TEACHER';
        this.isSearching = false;

        if(this.isTeacher){
          this.alreadyInCourse = false;
          return;
        }
        //Comprobar si el estudiante ya está en el curso
        this.courseService.getCourseById(this.courseId).subscribe({
          next: (course) => {
            this.alreadyInCourse = course.students.some(std => Number(std.id) === Number(studentId));
            console.log("¿Ya está matriculado?:", this.alreadyInCourse);
          }
        });
      },
      error: (err) => {
        this.resetSearchState();
        this.studentNotFound = true; // ⬅️ Confirmado: NO EXISTE
        this.isSearching = false;
        console.log("ERROR AL BUSCAR:", err);
      }
    });
  }

  onSubmit(): void{
    const studentId = this.addForm.value.studentId;

    if(this.isTeacher){
      this.snackBar.open("No se puede añadir un profesor como alumno ❌",'',{duration:2000});
      return;
    }
    if(this.alreadyInCourse){
      this.snackBar.open("El alumno ya está en el curso ❌",'',{duration:2000});
      return;
    }

    // ✔ Comprobar nuevamente antes de añadir
  this.courseService.getCourseById(this.courseId).subscribe({
    next: (course) => {

      const exists = course.students.some(s => Number(s.id) === Number(studentId));

      if (exists) {
        this.snackBar.open("El alumno ya está en el curso ❌",'',{duration:2500});
        this.alreadyInCourse = true;
        return;
      }
      //Añadir estudiante al curso
      this.courseService.addStudentToCourse(this.courseId,studentId).subscribe({
        next: () => {
          this.snackBar.open("Alumno añadido correctamente",'',{duration:2000});
          this.addForm.reset();
          this.selectedStudent = null;
          this.alreadyInCourse = false;
          this.isTeacher = false;
          this.loadStudents(); //Recargar la lista de estudiantes
        },
        error: () => this.snackBar.open('Error al añadir alumno ❌', '', { duration: 2000 }) /* */
      });
   }
  });

  }

  loadStudents(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.courseData = course;
        this.students = course.students;
        //console.log('🟢 Estudiantes cargados:', this.students);
      },
      error: (err) => {
        console.error('❌ Error al cargar datos del curso', err);
      }
    });
  }

   private resetSearchState() {
    this.selectedStudent = null;
    this.alreadyInCourse = false;
    this.isTeacher = false;
    this.studentNotFound = false;
  }
}
