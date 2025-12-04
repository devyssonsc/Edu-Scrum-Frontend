import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../../components/stats-card/stats-card.component'; 

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './teacher-detail.component.html',
  styleUrl: './teacher-detail.component.scss'
})
export class TeacherDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  teacherForm: FormGroup;
  teacherId: string | null = null; 

  mockTeacherData = {
    name: 'Fátima Leal',
    email: 'fatimal@upt.pt',
    stats: {
      coursesCount: 3,       
      totalStudents: 145,    
    },
    teachingCourses: [
      { code: 'QS', name: 'Qualidade de Software' },
      { code: 'ES', name: 'Engenharia de Software' },
      { code: 'GPS', name: 'Gestão de Projetos' }
    ]
  };

  constructor() {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courses: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.teacherId = this.route.snapshot.paramMap.get('id');
    
    if (this.teacherId) {
      this.loadData();
    }
  }

  loadData() {
    this.teacherForm.patchValue({
      name: this.mockTeacherData.name,
      email: this.mockTeacherData.email
    });
    
    const coursesArray = this.teacherForm.get('courses') as FormArray;
    coursesArray.clear();

    this.mockTeacherData.teachingCourses.forEach(c => {
      const group = this.fb.group({
        code: [c.code],
        name: [c.name]
      });
      coursesArray.push(group);
    });
  }

  get courses() {
    return this.teacherForm.get('courses') as FormArray;
  }

  onSubmit() {
    if (this.teacherForm.valid) {
      console.log('Dados do Professor a salvar:', {
        originalId: this.teacherId,
        ...this.teacherForm.value
      });
      alert('Professor atualizado com sucesso!');
      this.router.navigate(['/admin-dashboard']);
    }
  }
}