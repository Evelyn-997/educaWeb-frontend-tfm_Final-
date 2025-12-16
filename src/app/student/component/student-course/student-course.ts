
import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon} from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StudentDocument, StudentDocumentService } from '../../service/document';
import { MatTab, MatTabGroup} from '@angular/material/tabs';
import { Course, CourseService } from '../../../teacher/service/course';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CourseNews, StudentService } from '../../service/student';

@Component({
  selector: 'app-student-course',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,FormsModule, MatInputModule, MatFormFieldModule, MatIcon, MatTableModule, MatTab, MatTabGroup],
  templateUrl: './student-course.html',
  styleUrl: './student-course.css',
  standalone: true
})

export class StudentCourse implements OnInit {
  courseId!: number;
  studentId!: number;
  courseData!: Course;
  documents: StudentDocument[] = [];
  loading = true;
  previewUrl: SafeResourceUrl | null = null;
  grades: any=null;
  news: CourseNews[] = [];

  constructor(
    private docService: StudentDocumentService,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private studentService: StudentService
  ) { }

ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.loadNews();

  }

/** 🔹 Obtener el nombre del curso */
  loadCourse(): void {
    this.courseService.getCourseStudentById(this.courseId).subscribe({
    //this.courseService.getCourseStudentById(this.courseId).subscribe({
        next: (course) => {
          this.courseData = course;
          this.loadDocumentsByCourse();
          this.getGrades();
          this.loading =false;
          console.log('Informacion obtenida: ',this.courseData);
        },
        error: (err) => {
          console.error('❌ Error al cargar el  curso', err);
          this.loading =false;
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

  /** 🟢 Abrir documento en una nueva pestaña */
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

  /** 🔹 Obtener las calificaciones del estudiante en este curso */
getGrades(): void {
  const username = localStorage.getItem("username");

  if (!username) {
    console.error("❌ No se encontró el nombre de usuario en localStorage");
    return;
  }

  // Encontrar al estudiante dentro del curso
  const student = this.courseData?.students?.find(s => s.username === username);

  if (!student) {
    console.error("❌ No se encontró al estudiante dentro del curso");
    return;
  }

  this.studentId = student.id;

  this.courseService.getGradesForStudents(this.courseId,this.studentId).subscribe({
    next: (res) => {
      this.grades = res;
      //console.log("📊 Notas obtenidas:", this.grades);
    },
    error: (err) => {
      console.error("❌ Error al obtener calificaciones", err);
    }
  });
}
   loadNews():void{
    this.studentService.getMyNews(this.courseId).subscribe({
      next:(data) =>{
        this.news = data;
        this.loading = false;
      },
      error:(err) =>{
        this.loading = false;
        console.log("ERROR: ",err);
      }
    })
  }

   download(id: number) {
    this.docService.downloadDocument(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "documento.pdf";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

}

