import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth';
import { SafeResourceUrl } from '@angular/platform-browser';
import { filter, map, Observable } from 'rxjs';

export interface DocumentData {
  id: number;
  name: string;
  version: string;
  uploadDate: Date;
  filePath: string;
}

interface CourseData{
  id: number;
  name: string;
  teacherName:string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: DocumentData[] = [];
  teacherCourses: CourseData[] = [];
  selectedCourseId: number | null = null;
  previewUrl: SafeResourceUrl | null = null;// Para vista previa
  renameMap: { [key: number]: string } = {}; // Ppara renombrar documentos
  selectedFile: File[] = []; //PAra subir ficheros

  dataSource: any; // Asignar el dataSource de la tabla aquí

  //Filtros y busqueda
  searchTerm: string = '';
  filterVersion: string = '';
  filterType: string = '';
  filterDate: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /* Cargar los cursos del profesor  */
  loadCourses(): void{
    this.http.get<CourseData[]>('http://localhost:8080/teacher/courses')
    .subscribe((courses) => {
      this.teacherCourses = courses;
    });
  }
  /*Obtener cursos del profesor */
  getTeacherCourses(): Observable<CourseData[]> {
    return this.http.get<CourseData[]>(
      'http://localhost:8080/teacher/courses'

    );
  }
  /* Cargar documentos del curso seleccionado */
  getDocumentsByCourse(): Observable<DocumentData[]> {
    if (!this.selectedCourseId){
      console.error('❌ No se ha seleccionado ningún curso');
      return new Observable<DocumentData[]>(); // Retorna un observable vacío
    }
    else{
      return this.http.get<DocumentData[]>(`http://localhost:8080/documents/courses/${this.selectedCourseId}`);
    }

  }
  /** Subir Documentos (REVISAR ) */
  uploadFiles(courseId: number, files: File[], username: string): Observable<number>{

    const formData = new FormData();
    formData.append('username',username);
    files.forEach(file => formData.append('file',file));
    // Creamos una petición HttpRequest con reportProgress habilitado
    const req = new HttpRequest('POST', `http://localhost:8080/documents/uploads/${courseId}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req).pipe(
      filter(event =>
        event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response), // Filtrar solo eventos de progreso
        map(event => {
          if (event.type === HttpEventType.UploadProgress) {
            // Calcular el progreso de la subida
            return Math.round((100 * event.loaded) / (event.total || 1));
          } else if( event.type === HttpEventType.Response) {
            return 100; // Subida completada
          }
        return 0;
      })
    );
  }
   /** Descargar Documento */
   downloadDocument(docId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/documents/download/${docId}?mode=attachment`, {
      responseType: 'blob'
    });
  }
   /** Arbir Documento en nueva pestana*/
   openDocument(docId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/documents/download/${docId}?mode=inline`, {
      responseType: 'blob'
    });
  }
  /** Borrar Documentos  */
  deleteDocument(docId: number):Observable<any> {
    return this.http.delete(`http://localhost:8080/documents/${docId}`);
  }
    /** REINICIAR VISTA PREVIA */
  closeDocument(): void{
    this.previewUrl = null;
  }
  // Renombrar Documento
 renameDocument(docId: number, newName: string): Observable<DocumentData> {
    return this.http.put<DocumentData>(
      `http://localhost:8080/documents/${docId}?newName=${encodeURIComponent(newName)}`,
      null
    );
  }
  // Cancelar renombrado
  cancelRename(doc: DocumentData): void {
    delete this.renameMap[doc.id];
  }

}
