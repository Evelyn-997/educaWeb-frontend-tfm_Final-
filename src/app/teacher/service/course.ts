import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  description: string ;
  code: string;
  teacherId: number;
  teacherName: string;
  teacherUsername: string;
  students: Student[];
}
export interface Student {
  id: number;
  username: string;
  name: string;
  lastName: string;
  email: string;
}
export interface CourseNews {
  id: number;
  text: string;
  createdAt: string;
}


@Injectable({
  providedIn: 'root'
})

export class CourseService{
  private apiUrl = 'http://localhost:8080/teacher';
  private apiStudentUrl = 'http://localhost:8080';
  constructor(
    private http: HttpClient
  ){}
  //Crear un curso
  create(course: Course): Observable<Course[]>{
    return this.http.post<Course[]>(`${this.apiUrl}/courses`,course);
  }
  //Obtener todos los cursos
  getAllCourses(): Observable<Course[]>{
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }
  //Actualizar un curso
  update(id:number, course:Course): Observable<Course>{
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`,course);
  }

//Obtener curso por ID
  getCourseById(id:number): Observable<Course>{
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCourseStudentById(studentId:number): Observable<Course>{
    return this.http.get<Course>(`http://localhost:8080/student/course/${studentId}`);
  }
  //Actualizar curso
  updateCourse(course:Course): Observable<Course>{
    return this.http.put<Course>(`${this.apiUrl}/${course.id}`,course);
  }
  //Eliminar un curso
  deleteCourses(id:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/delete/course/${id}`);
  }
// Añadir Estudiantes al curso
  addStudentToCourse(courseId:number,studentId:number): Observable<any>{
    return this.http.post(`${this.apiUrl}/courses/${courseId}/students/${studentId}`,{});
  }
  //Eliminar estudiante de un curso
  removeStudentFromCourse(courseId: number, studentId: number): Observable<Course> {
    return this.http.delete<Course>(`${this.apiUrl}/courses/${courseId}/students/${studentId}`);
  }
  // Obtener estudiante por ID
  getStudentById(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/${studentId}`);
  }
  //Obtener estudiantes por curso
  getStudentByCourse(id:number): Observable<Student[]>{
    //Recibo un Objeto COurseREsponse del backend y devuelvo un Arraay de estudiantes
    return this.http.
    get<Course>(`${this.apiUrl}/courses/${id}/students`)
    .pipe(map((res) => res.students || []));
  }
  //
  saveStudentGrade(courseId:number, studentId:number, gradeDto:any): Observable<any>{
    return this.http.post(
      `${this.apiUrl}/courses/${courseId}/students/${studentId}/grades`,gradeDto);
  }

  getGradesForStudents(courseId:number, studentId:number): Observable<any>{
    return this.http.get(
      `${this.apiStudentUrl}/courses/${courseId}/students/${studentId}/grades`);
  }
  getGradesForCourse(courseId:number): Observable<any>{
    return this.http.get(`${this.apiUrl}/courses/${courseId}/grades`);
  }

  addCourseNews(courseId: number, body: { text: string }) {
    return this.http.post(
      `${this.apiUrl}/courses/${courseId}/news`,body);
  }

  getCourseNews(courseId: number) {
    return this.http.get<CourseNews[]>(
      `${this.apiUrl}/course/${courseId}/news`);
}


}
