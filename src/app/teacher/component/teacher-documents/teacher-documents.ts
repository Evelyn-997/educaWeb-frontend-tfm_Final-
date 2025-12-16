import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/service/auth';
import { DocumentService } from '../../service/document';
import { HttpClient} from '@angular/common/http';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from '../../service/course';

interface DocumentData{
  id: number;
  name: string;
  version: string;
  uploadDate: Date;
  filePath: string;
}

interface Course{
  id: number;
  name:string;
  teacherName:string;
}
@Component({
  selector: 'app-teacher-documents',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './teacher-documents.html',
  styleUrls: ['./teacher-documents.css'],
  standalone: true
})


export class TeacherDocuments implements OnInit{
  documents: DocumentData[] = [];
  courseData!: Course;
  selectedCourseId: number | null = null;
  courseId!: number;
  selectedFile: File[] = []; //PAra subir ficheros
  courseName!: string;
  previewUrl: SafeResourceUrl | null = null;
  renameMap: Record<number, string> = {};

  constructor(
    private docService: DocumentService,
    private courseService: CourseService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient,

  ){}


  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id_course'));
    this.loadCourses();
  }

  loadCourses(): void{
     this.courseService.getCourseById(this.courseId).subscribe({
        next: (course) => {
          this.courseData = course;
          this.loadDocumentsByCourse();
          console.log('Informacion obtenida: ',this.courseData);
          this.courseName = course.name;
        },
        error: (err) => {
          console.error('❌ Error al cargar el  curso', err);
        }
      });
  }
  /** Cargar documentos del curso seleccionado */
  loadDocumentsByCourse(): void {
    this.docService.selectedCourseId = this.courseId
     this.docService.getDocumentsByCourse().subscribe({
    next:(docs) => {
      this.documents = docs;
    },
    error:(err) => console.error("❌ Error al cargar los documentos ",err)
   });
  }

  /** Seleccionar archivos manualmente */
  onFileSelected(event:any): void{
    this.selectedFile = Array.from(event.target.files);
  }

  /** Subir Documentos (REVISAR ) */
  uploadFiles(course_Id: number, file: File, username: string){
    if (!this.courseId || this.selectedFile.length === 0) {
      alert('Selecciona un curso y al menos un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file',file);
    formData.append('username',username);

    this.http.post(`http://localhost:8080/documents/uploads/${course_Id}`, formData,
      { observe: 'response' } //Opción vacía que fuerza el interceptor
    ).subscribe({
        next: (res) => {
          console.log('✅ Documentos subidos correctamente', res);
          this.selectedFile = [];
          this.loadDocumentsByCourse();
        },
        error:err => console.error('❌ Error al subir documentos',err)
      });
  }
  /** Iniciar subida de archivos */
  upload(){
    this.uploadFiles(this.courseId!, this.selectedFile[0], this.authService.getUserFromToken().username);
  }

  /** REINICIAR VISTA PREVIA */
  closePreview(): void{
    this.previewUrl = null;
  }

  /** Borrar Documentos  */
  deleteDocument(id: number): void{
    if(confirm('¿Está seguro de que desea eliminar este documento?')){
      this.http.delete(`http://localhost:8080/documents/delete/${id}`)
      .subscribe({
        next:() => {
          alert('Documento eliminado correctamente');
          this.loadDocumentsByCourse();
        }
      });
    }
  }

  /** Descargar Documento */
  downloadDocument(doc: DocumentData): void{
    const url = `http://localhost:8080/documents/download/${doc.id}?mode=attachment`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = doc.name;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    error: (e) => console.error('❌ Error al descargar', e)
  });
  }

   /** Arbir Documento en nueva pestana*/
  openDocument(doc: DocumentData): void{
    const url = `http://localhost:8080/documents/download/${doc.id}?mode=inline`;
    //window.open(url, '_blank');
    this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      // Crear URL temporal en el navegador
      const blobUrl = URL.createObjectURL(blob);
      // Abrir el PDF o imagen en una nueva pestaña
      window.open(blobUrl, '_blank');
    },
    error: (err) => {
      console.error('❌ Error al abrir documento:', err);
      alert('No se pudo abrir el documento (403 o error de conexión)');
    }
  });
  }

  // ------- Renombrar -------
  queueRename(doc: DocumentData): void {
    if (!(doc.id in this.renameMap)) {
      this.renameMap[doc.id] = doc.name;
    }
  }

  saveRename(doc: DocumentData): void {
    const newName = (this.renameMap[doc.id] || '').trim();
    if (!newName) { alert('Introduce un nombre válido.'); return; }

    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${this.authService.accessToken}`
    // });

    this.http.put<DocumentData>(
      `http://localhost:8080/documents/${doc.id}?newName=${encodeURIComponent(newName)}`,
      null
    ).subscribe({
      next: (updated) => {
        // actualiza en la tabla
        const idx = this.documents.findIndex(d => d.id === doc.id);
        if (idx >= 0) this.documents[idx].name = updated.name;
        delete this.renameMap[doc.id];
      },
      error: (e) => {
        console.error('❌ Error al renombrar', e);
        alert('Error al renombrar');
      }
    });
  }

  cancelRename(doc: DocumentData): void {
    delete this.renameMap[doc.id];
  }
}

