import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../service/course';
import { CommonModule } from '@angular/common';
import {  Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCard} from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-course-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ɵInternalFormsSharedModule, MatInputModule, MatButtonModule, MatCard, MatIcon],
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.css'],
  standalone:true
})
export class CourseForm implements OnInit {
  courseForm: FormGroup;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private router:Router
  ){
    this.courseForm = this.fb.group({
      name:['',Validators.required],
      description:[''],
      code:['', Validators.required]
    });
  }
  ngOnInit(): void {

  }

  onSubmit(){
    if(this.courseForm.valid){
      this.courseService.create(this.courseForm.value).subscribe({
        next: (res) => {
          console.log("Curso creado correctamente.",res);
          this.router.navigate(['/teacher/courses']);
        },
        error: ()=> alert("Error al crear el curso")
    });
    }
  }
}
