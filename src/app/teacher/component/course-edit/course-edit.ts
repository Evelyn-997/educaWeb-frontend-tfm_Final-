import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Course, CourseService, Student } from '../../service/course';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCell, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-course-edit',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,FormsModule , MatProgressSpinnerModule,MatFormFieldModule, MatCell, MatTableModule, MatIconModule],
  templateUrl : './course-edit.html',
  styleUrls: ['./course-edit.css'],
  standalone: true
})
export class CourseEdit implements OnInit {
  courseForm!: FormGroup;
  courseId!: number;
  loading: boolean = true;
  courseData!: Course;
  newStudentId = new FormControl('');
  students: Student[]= [];
  dataSource =  new MatTableDataSource<Student>();


  displayedColumns: string[] = ['id','name','lastName', 'email', 'username','actions'];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private fb: FormBuilder
  ){}

  ngOnInit(){
    this.courseId = Number(this.route.snapshot.paramMap.get('id_course'));
    //Inicializar el formulario
    this.courseForm = this.fb.group({
      name:['',Validators.required],
      code:['', Validators.required],
      description:['', Validators.required],
      students:['',Validators.required]
    });
    //Cargar datos del curso
    this.loadCourseData();
    //Escuchar los cambios en el formulario
    this.courseForm.valueChanges.subscribe(value =>{
      console.log('Formulario cambiado:', value);
      this.loading = false;
    });
  }

  /* Cargar informacion previa del curso */
  loadCourseData(){
    this.courseService.getCourseById(this.courseId).subscribe(course =>{
      this.courseForm.patchValue(course);
      this.loading = false;
      console.log('📘 Curso recibido:', course);
      this.courseData=course;
    });
  }

  viewStudents(courseId?:number): void{
    if (!courseId) {
      console.error('⚠️ courseId no válido:', courseId);
      console.log('Course ID recibido en viewStudents:', courseId);
      return;
    }
    this.courseService.getStudentByCourse(courseId).subscribe({
      next: (studentD) =>  {
        this.students = studentD;
        this.dataSource.data = this.students;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        console.log('✅ Estudiantes del curso cargados:', this.students);
              },
      error: (err) => console.error('❌ Error al cargar los estudiantes del curso',err)
    });
     //this.router.navigate(['/teacher/courses',courseId,'students'])
  }

  removeStudents(studentId:number):void{
    if (confirm('¿Seguro que quieres eliminar a este estudiante del curso?')) {
    this.courseService.removeStudentFromCourse(this.courseId, studentId).subscribe({
      next: (updatedCourse) => {
        this.courseData = updatedCourse;
        alert('🗑️ Estudiante eliminado correctamente');
      },
      error:(err) =>{
        console.error('Error al elimnar al estudiante. ',err);
        alert('Error al eliminar al estudiante');
      }
      });
    }
  }

  /** ➕ Añadir estudiante por ID */
  addStudent(): void {
    const id = Number(this.newStudentId.value);
    if (!id || isNaN(id)) {
      alert('Introduce un ID válido');
      return;
    }

    this.courseService.addStudentToCourse(this.courseId, id).subscribe({
      next: (updatedCourse) => {
        this.courseData = updatedCourse;
        this.newStudentId.reset();
        alert('👩‍🎓 Estudiante añadido correctamente');
      },
      error: (err) => {
        console.error('❌ Error al añadir estudiante', err);
        alert('No se pudo añadir el estudiante');
      },
    });
  }

  onSubmit(){
    //Guardar cambios
    if(this.courseForm.valid){
      const updatedCourse: Course = { id: this.courseId, ...this.courseForm.value};

      this.courseService.updateCourse(updatedCourse).subscribe(()=>{
        alert('Curso actualizado con ÈXITO');
        this.router.navigate(['teacher/courses']);
      });
    }
    this.viewStudents(this.courseId);
  }
}
