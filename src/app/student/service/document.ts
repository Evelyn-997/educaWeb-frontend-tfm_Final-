import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';

export interface StudentDocument {
  id: number;
  name: string;
  version: string;
  uploadDate: Date;
  filePath: string;
}

export interface StudentCourse {
  id: number;
  name: string;
  teacherName: string;
}

@Injectable({
  providedIn: 'root',
})
export class StudentDocumentService {
  studentCourses: StudentCourse[] = [];
  documents: StudentDocument[] = [];
  selectedCourseId: number | null = null;
  previewUrl: SafeResourceUrl | null = null;
  dataSource: any;

  constructor(
    private http: HttpClient
  ) {}

  //obtener los cursos del estudiante
  getStudentCourses(): Observable<StudentCourse[]> {
      return this.http.get<StudentCourse[]>(
        'http://localhost:8080/student/courses'
      );
    }
  //Obtener los docuemntos del curso
  getDocumentsByCourse(): Observable<StudentDocument[]> {
    if (!this.selectedCourseId){
          console.error('❌ No se ha seleccionado ningún curso');
          return new Observable<StudentDocument[]>(); // Retorna un observable vacío
        }
        else{
          return this.http.get<StudentDocument[]>(`http://localhost:8080/documents/courses/${this.selectedCourseId}`);
        }
  }
//Descargar los docuemntos
  downloadDocument(docId: number): Observable<Blob> {
    return this.http.get(
      `http://localhost:8080/documents/download/${docId}?mode=attachment`,
      { responseType: 'blob' }
    );
  }
  //Abrir los docuemntos - Vista previa
  openDocument(docId: number): Observable<Blob> {
    return this.http.get(
      `http://localhost:8080/documents/download/${docId}?mode=inline`,
      { responseType: 'blob' }
    );
  }
  //Cerrar vista previa
  closePreview(): void {
    this.previewUrl = null;
  }

}
