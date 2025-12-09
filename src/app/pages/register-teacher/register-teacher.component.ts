import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

interface Course {
  id: number;
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

  isSubmitted = false;

  allCourses: Course[] = [
    { id: 1, name: 'Qualidade de Software' },
    { id: 2, name: 'Inteligência Artificial' },
    { id: 3, name: 'Prog. Web' },
    { id: 4, name: 'Bases de Dados' },
    { id: 5, name: 'Sistemas Operativos' }
  ];

    selectedCourseId = new FormControl<number | null>(null, Validators.required);
    showAddInputs = false;

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

  newCourseGroup(name: string): FormGroup {
    return this.fb.group({
      name: [name]
    });
  }

  showAddCourseFields() {
    this.selectedCourseId.reset(null);
    this.showAddInputs = true;
  }

  
  cancelAddCourse() {
    this.showAddInputs = false;
  }

  confirmAddCourse() {
    this.selectedCourseId.markAsTouched();

    if (this.selectedCourseId.invalid) {
      return;
    }
    
    const courseId = Number(this.selectedCourseId.value);
    const selectedCourse = this.allCourses.find(c => c.id === courseId);

    if (!selectedCourse) return;

    const isDuplicate = this.courses.controls.some(control => 
      control.value.name === selectedCourse.name
    );

    if (isDuplicate) {
      this.selectedCourseId.setErrors({ 'duplicate': true });
    } else {
      this.courses.push(this.newCourseGroup(selectedCourse.name));
      this.cancelAddCourse();
    }
  }

  removecourse(index: number) {
    this.courses.removeAt(index);
  }

  onSubmit() {
    this.isSubmitted = true; 
    this.teacherForm.markAllAsTouched();
    
    if (this.teacherForm.valid) {
      console.log('Formulário Válido:', this.teacherForm.value);
    } else {
      console.log('Formulário Inválido');
    }
  }
}