import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

    allDegrees: any[] = [
      { id: 1, code: 'EI', name: 'Engenharia Informática' },
      { id: 2, code: 'SIG', name: 'Sistemas de Informação para Gestão' },
      { id: 3, code: 'RI', name: 'Relações Internacionais' },
      { id: 4, code: 'ES', name: 'Educação Social' },
      { id: 5, code: 'EGI', name: 'Engenharia e Gestão Industrial' }
    ];
    
  selectedDegreeId = new FormControl<number | null>(null, Validators.required);

  selectDegree() {
    this.selectedDegreeId.markAsTouched();

    if (this.selectedDegreeId.invalid) {
      return;
    }
    
    const degreeId = Number(this.selectedDegreeId.value);
    const selectedDegree = this.allDegrees.find(c => c.id === degreeId);

    if (!selectedDegree) return;

    this.studentForm.get("degree")?.setValue(selectedDegree);
  }


  onSubmit() {
    if (this.studentForm.valid) {

      //linha temporaria, depois é pra validar se um curso foi colocado ou não
      this.studentForm.value.degree = null
      const firstName = this.studentForm.value.name.trim().split(' ')[0];
      this.studentForm.value.password = firstName + "12345"

      console.log('Formulário Válido (Student):', this.studentForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/users`, this.studentForm.value).subscribe(response => {
              console.log('Resposta do servidor:', response);
            })
    } else {
      console.log('Formulário Inválido');
      this.studentForm.markAllAsTouched();
    }
  }
}