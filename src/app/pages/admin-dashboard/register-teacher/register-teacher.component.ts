import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-teacher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-teacher.component.html',
  styleUrl: './register-teacher.component.scss'
})
export class RegisterTeacherComponent implements OnInit {
removeCadeira(_t31: number) {
throw new Error('Method not implemented.');
}

  private fb = inject(FormBuilder);
  teacherForm: FormGroup;
cadeiras: any;

  constructor() {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required] // Departamento a que pertence
    });
  }

  ngOnInit(): void {
    // Aqui poderias carregar a lista de departamentos
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      console.log('Formulário Válido (Teacher):', this.teacherForm.value);
      // ...chamar serviço para guardar o professor...
    } else {
      console.log('Formulário Inválido');
      this.teacherForm.markAllAsTouched();
    }
  }
}