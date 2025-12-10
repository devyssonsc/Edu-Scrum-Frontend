import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/dataService';

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
  private dataService = inject(DataService);

  projectForm: FormGroup;
  courseId: string | null = null;
  courseName: string = '';

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''] // Campo opcional
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    
    const state = history.state;
    if (state && state.courseName) {
      this.courseName = state.courseName;
    } else if (this.courseId) {
      this.dataService.getCourseByCode(this.courseId).subscribe(c => {
        this.courseName = c ? c.name : this.courseId!;
      });
    }
  }

  onSubmit() {
    if (this.projectForm.valid && this.courseId) {
      const start = new Date(this.projectForm.value.startDate);
      const end = new Date(this.projectForm.value.endDate);

      if (end <= start) {
        alert('End date must be after start date.');
        return;
      }

      // Constrói o objeto com TODOS os campos
      const newProject = {
        name: this.projectForm.value.name,
        courseCode: this.courseId,
        startDate: this.projectForm.value.startDate,
        endDate: this.projectForm.value.endDate,
        description: this.projectForm.value.description // Garante que a descrição vai aqui
      };

      this.dataService.createProject(newProject).subscribe((success: boolean) => {
        if (success) {
          alert('Project created successfully!');
          // Redireciona para a lista da cadeira
          this.router.navigate(['/teacher-dashboard/course', this.courseId]);
        }
      });

    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}