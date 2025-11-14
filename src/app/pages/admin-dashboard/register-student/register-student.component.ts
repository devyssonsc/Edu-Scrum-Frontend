import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor() {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Validador de email
      studentNumber: ['', Validators.required], // Número de aluno
      degree: ['', Validators.required] // Curso a que pertence
    });
  }

  ngOnInit(): void {
    // Aqui poderias carregar a lista de "degrees" (cursos) para um <select>
  }

  onSubmit() {
    if (this.studentForm.valid) {
      console.log('Formulário Válido (Student):', this.studentForm.value);
      // ...chamar serviço para guardar o estudante...
    } else {
      console.log('Formulário Inválido');
      this.studentForm.markAllAsTouched();
    }
  }
}