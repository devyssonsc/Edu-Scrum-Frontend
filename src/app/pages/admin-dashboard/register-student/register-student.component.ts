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
      email: ['', [Validators.required, Validators.email]],
      studentNumber: ['', Validators.required],
      degree: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.studentForm.valid) {
      console.log('Formulário Válido (Student):', this.studentForm.value);
    } else {
      console.log('Formulário Inválido');
      this.studentForm.markAllAsTouched();
    }
  }
}