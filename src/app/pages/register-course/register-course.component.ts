import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FormArray, FormControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';

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

  constructor(private httpClient: HttpClient) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      degreeId: [null, Validators.required]

    });
  }

  selectedDegreeId = new FormControl<number | null>(null, Validators.required);

  ngOnInit(): void {
    this.loadDegrees();
  }

  allDegrees: any[] = [];
  loadDegrees() {
  const token = localStorage.getItem('token');

  this.httpClient.get<any[]>(`${enviroments.apiUrl}/degrees`)
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

  if (this.selectedDegreeId.invalid) return;

  const degreeId = Number(this.selectedDegreeId.value);

  this.courseForm.patchValue({ degreeId });  
}

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Formulário Válido (Course):', this.courseForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/degrees/${this.courseForm.value.degreeId}/courses`, this.courseForm.value).subscribe(r => 
        console.log("Course criado:", r));
    } else {
      console.log('Formulário Inválido');
      this.courseForm.markAllAsTouched();
    }
  }
}