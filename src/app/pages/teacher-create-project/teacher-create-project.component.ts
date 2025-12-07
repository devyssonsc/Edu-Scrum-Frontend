import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-create-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-create-project.component.html',
  styleUrl: './teacher-create-project.component.scss'
})
export class TeacherCreateProjectComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  projectForm: FormGroup;
  courseId: string | null = null;

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''] // Opcional, mas útil
    });
  }

  ngOnInit() {
    // Captura o ID da cadeira da URL para saber onde criar o projeto
    this.courseId = this.route.snapshot.paramMap.get('courseId');
  }

  onSubmit() {
    if (this.projectForm.valid) {
      // Validação extra de datas
      const start = new Date(this.projectForm.value.startDate);
      const end = new Date(this.projectForm.value.endDate);

      if (end <= start) {
        alert('A data de fim deve ser posterior à data de início.');
        return;
      }

      console.log('Criar Projeto para a cadeira:', this.courseId);
      console.log('Dados do Projeto:', this.projectForm.value);
      
      // Simula sucesso e volta para o detalhe da cadeira
      alert('Projeto criado com sucesso!');
      this.router.navigate(['/teacher-dashboard/course', this.courseId]);
    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}