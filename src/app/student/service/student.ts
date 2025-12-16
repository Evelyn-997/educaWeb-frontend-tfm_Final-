import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../../teacher/service/course';
import { Observable } from 'rxjs';
import { StudentGlobalProgress, StudentProgressResponse } from '../component/student-progress/student-progress';


export interface CourseNews {
  id: number;
  text: string;
  courseName: string;
  createdAt: string;
}
@Injectable({
  providedIn: 'root',
})
export class StudentService {
   private apiUrl = 'http://localhost:8080/student';

   constructor(
    private http: HttpClient
   ){}

   getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getCourseProgress(courseId: number): Observable<StudentProgressResponse> {
    return this.http.get<StudentProgressResponse>(
      `${this.apiUrl}/courses/${courseId}/progress`
    );
  }

  getGlobalProgress(): Observable<StudentGlobalProgress> {
    return this.http.get<StudentGlobalProgress>(
      `${this.apiUrl}/progress`
    );
  }

  getMyNews(courseId: number){
    return this.http.get<CourseNews[]>(`${this.apiUrl}/course/${courseId}/news`);
  }

}
