import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

interface Course {
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-register-teacher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-teacher.component.html',
  styleUrl: './register-teacher.component.scss'
})
export class RegisterTeacherComponent implements OnInit {

  private fb = inject(FormBuilder);
  teacherForm: FormGroup;
  showCourseList = false; 

  allCourses: Course[] = [
    { id: 1, code: 'QS', name: 'Qualidade de Software' },
    { id: 2, code: 'IA', name: 'Inteligência Artificial' },
    { id: 3, code: 'PWEB', name: 'Prog. Web' },
    { id: 4, code: 'BD', name: 'Bases de Dados' },
    { id: 5, code: 'SO', name: 'Sistemas Operativos' }
  ];

  constructor() {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courses: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void { }

  get courses() {
    return this.teacherForm.get('courses') as FormArray;
  }

  newCourse(course: Course): FormGroup {
    return this.fb.group({
      id: [course.id],
      code: [course.code],
      name: [course.name]
    });
  }

  addCourse(course: Course) {
    const alreadyAdded = this.courses.controls.some(control => control.value.id === course.id);
    
    if (!alreadyAdded) {
      this.courses.push(this.newCourse(course));
    }
    this.showCourseList = false; 
  }

  removeCourse(index: number) {
    this.courses.removeAt(index);
  }

  toggleCourseList() {
    this.showCourseList = !this.showCourseList;
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      console.log('Formulário Válido (Teacher):', this.teacherForm.value);
    } else {
      console.log('Formulário Inválido');
      this.teacherForm.markAllAsTouched();
    }
  }
}