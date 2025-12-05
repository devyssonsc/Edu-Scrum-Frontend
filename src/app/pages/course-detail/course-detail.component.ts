import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component'; 

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  courseForm: FormGroup;
  courseId: string | null = null;

  mockCourseData = {
    code: 'QS',
    name: 'Qualidade de Software',
    degree: 'Engenharia Informática',
    ects: 6,
    stats: {
      studentsCount: 52,    
      teachersCount: 2,     
      avgGrade: 14.5        
    },

    teachers: [
      { name: 'Fátima Leal', email: 'fatimal@upt.pt' },
      { name: 'Bruno Cunha', email: 'bruninho@upt.pt' }
    ]
  };

  constructor() {

    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      degree: ['', Validators.required],
      ects: [null, [Validators.required, Validators.min(1), Validators.max(20)]],
      teachers: this.fb.array([]) 
    });
  }

  ngOnInit() {

    this.courseId = this.route.snapshot.paramMap.get('id');
    
    if (this.courseId) {
      this.loadData();
    }
  }

  loadData() {
    this.courseForm.patchValue({
      name: this.mockCourseData.name,
      degree: this.mockCourseData.degree,
      ects: this.mockCourseData.ects
    });
    
    const teachersArray = this.courseForm.get('teachers') as FormArray;
    teachersArray.clear();

    this.mockCourseData.teachers.forEach(t => {
      const group = this.fb.group({
        name: [t.name, Validators.required],
        email: [t.email, [Validators.required, Validators.email]]
      });
      teachersArray.push(group);
    });
  }

  get teachers() {
    return this.courseForm.get('teachers') as FormArray;
  }

  removeTeacher(index: number) {
    this.teachers.removeAt(index);
    this.courseForm.markAsDirty();
  }

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Dados da Cadeira a salvar:', {
        originalCode: this.courseId,
        ...this.courseForm.value
      });
      alert('Cadeira atualizada com sucesso!');
      this.router.navigate(['/admin-dashboard']);
    }
  }
}