import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

interface AvailableCourse {
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-register-degree',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-degree.component.html',
  styleUrl: './register-degree.component.scss'
})
export class RegisterDegreeComponent implements OnInit {

  private fb = inject(FormBuilder);
  degreeForm: FormGroup;
  
  isSubmitted = false;

  allCourses: AvailableCourse[] = [
    { id: 1, code: 'IA', name: 'Inteligência Artificial' },
    { id: 2, code: 'QS', name: 'Qualidade de Software' },
    { id: 3, code: 'PWEB', name: 'Programação Web' },
    { id: 4, code: 'BD', name: 'Bases de Dados' },
    { id: 5, code: 'SO', name: 'Sistemas Operativos' }
  ];

  selectedCourseId = new FormControl<number | null>(null, Validators.required);
  
  showAddInputs = false;

  constructor() {
    this.degreeForm = this.fb.group({
      name: ['', Validators.required],
      courses: this.fb.array([], Validators.minLength(1)) 
    });
  }

  ngOnInit(): void {
  }

  get courses() {
    return this.degreeForm.get('courses') as FormArray;
  }

  newCourseGroup(name: string): FormGroup {
    return this.fb.group({
      name: [name],
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
    this.degreeForm.markAllAsTouched();
    
    if (this.degreeForm.valid) {
      console.log('Formulário Válido:', this.degreeForm.value);
    } else {
      console.log('Formulário Inválido');
    }
  }
}