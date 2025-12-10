import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';


@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.scss'
})
export class RegisterStudentComponent{

  private fb = inject(FormBuilder);
  studentForm: FormGroup;

  constructor(private httpClient: HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      degree: [''],
      user_type: ['STUDENT'],  
      role: ['STUDENT']   

    });
  }

  ngOnInit(): void {this.loadDegrees();}
    
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

  selectedDegreeId = new FormControl<number | null>(null, Validators.required);
  selectDegree() {
    this.selectedDegreeId.markAsTouched();

    if (this.selectedDegreeId.invalid) {
      return;
    }
    
    const degreeId = Number(this.selectedDegreeId.value);
    this.studentForm.get("degree")?.setValue(degreeId);
  }


  onSubmit() {
    if (this.studentForm.valid) {

      const firstName = this.studentForm.value.name.trim().split(' ')[0];
      this.studentForm.value.password = firstName + "12345"

      console.log('Formulário Válido (Student):', this.studentForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/users`, this.studentForm.value).subscribe((response: any) => {
              console.log('Resposta do servidor:', response);
              alert('The Student was successfully registered.');

              this.httpClient.post(`${enviroments.apiUrl}/degrees/${this.studentForm.value.degree}/students/${response.id}`, this.studentForm.value).subscribe(response => {
              console.log('Resposta do servidor:', response);
              })
            
            },
             (err: HttpErrorResponse) => {
               if(err.status === 409) {
                 alert('This Student Already Exists.');
               } else {
                 alert(`An error has ocurred. Try again later.`);
               }
             });
    } else {
      console.log('Formulário Inválido');
      this.studentForm.markAllAsTouched();
    }
  }
}