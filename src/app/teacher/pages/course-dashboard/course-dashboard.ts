import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DocumentData, DocumentService } from '../../service/document';
import { Course, CourseNews, CourseService} from '../../service/course';
import { MatTab, MatTabGroup} from '@angular/material/tabs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../../../core/notification/notification';



@Component({
  selector: 'app-course-dashboard',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,FormsModule, MatInputModule, MatFormFieldModule, MatIcon, MatTableModule, MatTab, MatTabGroup],
  templateUrl: './course-dashboard.html',
  styleUrls: ['./course-dashboard.css'],
  standalone: true
})
export class CourseDashboard implements OnInit {
  courseId!: number;
  courseData!: Course;
  documents: DocumentData[] = [];
  loading = true;
  previewUrl: SafeResourceUrl | null = null;
  students: any[] = [];
  grades: any;
  /**Formulario de novedades */
  newForm!: FormGroup;
  news: CourseNews[] = [];


  constructor(
    private docService: DocumentService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private notification: NotificationService,
    private fb:FormBuilder
  ) {
    this.newForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(5)]]
    });
   }

ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.loadStudents();
    this.loadNews();
    this.notification.connect();

  }
/** 🔹 Obtener el nombre del curso */
  loadCourse(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          this.courseData = course;
          this.loadDocumentsByCourse();
          this.loading =false;
          //console.log('Informacion obtenida: ',this.courseData);
          //console.log('Studiantes: ',this.courseData.students);
        },
        error: (err) => {
          console.error('❌ Error al cargar el  curso', err);
          this.loading =false;
        }
      });
  }

  loadStudents(): void {
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (list) => {
        this.students = list.students.map(student => ({
          ...student,
          activities: [],
          exams: [],
        }));
        //console.log('Estudiantes cargados:', this.students);
        this.getGrades();
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar los estudiantes', err);
        this.loading = false;
      }
    });
  }

 /** Cargar documentos del curso seleccionado */
  loadDocumentsByCourse(): void {
   this.docService.selectedCourseId= this.courseId;
   this.docService.getDocumentsByCourse().subscribe({
    next:(docs) => (
      this.documents = docs
    ),
    error:(err) => console.error("X Error al cargar los documentos ",err)
   });
  }
  /** Abrir documento en una nueva pestaña */
  openDocument(docId: number): void {
    this.docService.openDocument(docId).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      },
      error: (err) => {
        console.error('❌ Error al abrir documento', err);
        alert('No se pudo abrir el documento');
      }
    });
  }

  saveGrade(student:any): void {
// Validar calificaciones entre 0 y 10
      for (let a of student.activities) {
        if (a.grade < 0 || a.grade > 10) {
          alert("Las notas de actividades deben estar entre 0 y 10");
          return;
        }
      }
      for (let e of student.exams) {
        if (e.grade < 0 || e.grade > 10) {
          alert("Las notas de exámenes deben estar entre 0 y 10");
          return;
        }
      }
    const gradeDto = {
      activities: student.activities,
      exams: student.exams
    };

    this.courseService.saveStudentGrade(this.courseId, student.id, gradeDto).subscribe({
      //envio notificacion al estudiante
      next:() => {
        //console.log(' Calificación guardada para el estudiante', student.id);
        //console.log("Se ha actualizado tu calificación en el curso", this.courseData.name);
        alert('Calificación guardada correctamente');
      },
      error: (err) => {
        console.error('❌ Error al guardar la calificación', err);
        alert('No se pudo guardar la calificación');
    }
    });
  }

  getGrades(): void {
    this.courseService.getGradesForCourse(this.courseId).subscribe({
      next: (res) => {
        //console.log("📊 Notas cargadas:", res);
        // Actualizo las calificaciones en la lista de estudiantes
        this.students = this.students.map(student => {
        const grade = res.find((g: any) => g.studentId === student.id);

        return {
          ...student,
          activities: grade?.activities || [],
          exams: grade?.exams || []
        };
      });
        //console.log("🟦 Estudiantes con notas combinadas:", this.students);
      },
      error: (err) => {
        console.error("❌ Error al obtener calificaciones", err);
      }
    });
  }

  addActivity(student: any) {
    if (!student.activities) {
      student.activities = [];
    }
    student.activities.push({ name: '', grade: null });
  }
  removeActivity(student: any, index: number) {
    student.activities.splice(index, 1);
  }

  addExam(student: any) {
    if (!student.exams) {
      student.exams = [];
    }
    student.exams.push({ name: '', grade: null });
  }
  removeExam(student: any, index: number) {
    student.exams.splice(index, 1);
  }

  /** Añadir novedad */
  addNews(): void {
    if (this.newForm.invalid) {
      alert('El texto de la novedad es obligatorio y debe tener al menos 5 caracteres.');
      return;
    }
    this.courseService.addCourseNews(this.courseId, this.newForm.value ).subscribe({
      next: () => {
        alert('Novedad añadida correctamente');
        this.news.unshift(this.newForm.value.text);
        this.newForm.reset();
      },
      error: (err) => {
        console.error('❌ Error al añadir novedad', err);
        alert('No se pudo añadir la novedad');
      }
    });
  }
  /*Obtener novedades del curso*/
  loadNews(): void{
    this.courseService.getCourseNews(this.courseId).subscribe({
    next: (data) => {
      this.news = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('❌ Error al cargar novedades', err);
      this.loading = false;
    }
  });
  }
}
