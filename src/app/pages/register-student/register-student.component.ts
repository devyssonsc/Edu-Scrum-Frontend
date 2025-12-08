import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class RegisterStudentComponent implements OnInit {

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

  ngOnInit(): void {
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