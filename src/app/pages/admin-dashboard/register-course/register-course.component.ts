import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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

  constructor() {
    this.courseForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      degree: ['', Validators.required],
      ects: [null, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  ngOnInit(): void {
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