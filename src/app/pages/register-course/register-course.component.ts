import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';

interface Degree {
  id: number;
  code: string;
  name: string;
}

@Component({
  selector: 'app-register-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-course.component.html',
  styleUrl: './register-course.component.scss'
})
export class RegisterCourseComponent implements OnInit {

  private fb = inject(FormBuilder);
  courseForm: FormGroup;
  showDegreeList = false;

  get degrees() {
  return this.courseForm.get('degrees') as FormArray;
  }

  constructor(private httpClient: HttpClient) {
    this.courseForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      degrees: this.fb.array([], Validators.required),
      ects: [null, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  newDegreeGroup(degree: Degree) {
    return this.fb.group({
      id: [degree.id],
      code: [degree.code],
      name: [degree.name]
    });
  }

  addDegree(degree: Degree) {
    const alreadyAdded = this.degrees.controls.some(d => d.value.id === degree.id);
    if (!alreadyAdded) {
      this.degrees.push(this.newDegreeGroup(degree));
    }
    this.showDegreeList = false;
  }

  removeDegree(index: number) {
    this.degrees.removeAt(index);
  }

  toggleDegreeList() {
    this.showDegreeList = !this.showDegreeList;
  }

  ngOnInit(): void {
    this.loadDegrees();
  }

  allDegrees: Degree[] = [];

  loadDegrees() {
  const token = localStorage.getItem('token');


  this.httpClient.get<Degree[]>(`${enviroments.apiUrl}/degrees`)
    .subscribe({
      next: (degrees) => {
        this.allDegrees = degrees;  
      },
      error: (err) => {
        console.error('Erro ao carregar degrees:', err);
      }
    });
}

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Formulário Válido (Course):', this.courseForm.value);
    } else {
      console.log('Formulário Inválido');
      this.courseForm.markAllAsTouched();
    }
  }
}