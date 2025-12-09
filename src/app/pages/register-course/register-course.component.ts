import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FormArray, FormControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      name: ['', Validators.required],
      degrees: ['', Validators.required]
    });
  }

  selectedDegreeId = new FormControl<number | null>(null, Validators.required);

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

  selectDegree() {
    this.selectedDegreeId.markAsTouched();

    if (this.selectedDegreeId.invalid) {
      return;
    }
    
    const degreeId = Number(this.selectedDegreeId.value);
    const selectedDegree = this.allDegrees.find(c => c.id === degreeId);

    if (!selectedDegree) return;

    this.courseForm.get("degree")?.setValue(selectedDegree);
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