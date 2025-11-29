import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../../components/stats-card/stats-card.component'; 

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './student-detail.component.html',
  styleUrl: './student-detail.component.scss'
})
export class StudentDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  studentForm: FormGroup;
  studentId: string | null = null;

  mockStudentData = {
    num: '50440',
    name: 'Tiago Silva',
    email: '50440@alunos.upt.pt',
    degree: 'Engenharia Informática',
    stats: {
      ectsCompleted: 120,  
      avgGrade: 15.2,       
      enrolledCourses: 6     
    },
    enrolledCoursesList: [
      { code: 'QS', name: 'Qualidade de Software', grade: '---' }, 
      { code: 'IA', name: 'Inteligência Artificial', grade: '16' },
      { code: 'PWEB', name: 'Programação Web', grade: '14' }
    ]
  };

  constructor() {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      degree: ['', Validators.required],
      courses: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.studentId = this.route.snapshot.paramMap.get('id');
    
    if (this.studentId) {
      this.loadData();
    }
  }

  loadData() {
    this.studentForm.patchValue({
      name: this.mockStudentData.name,
      email: this.mockStudentData.email,
      degree: this.mockStudentData.degree
    });
    
    const coursesArray = this.studentForm.get('courses') as FormArray;
    coursesArray.clear();

    this.mockStudentData.enrolledCoursesList.forEach(c => {
      const group = this.fb.group({
        code: [c.code], // Apenas leitura
        name: [c.name], // Apenas leitura
        grade: [c.grade] 
      });
      coursesArray.push(group);
    });
  }

  get courses() {
    return this.studentForm.get('courses') as FormArray;
  }

  removeCourse(index: number) {
    this.courses.removeAt(index);
    this.studentForm.markAsDirty();
  }

  onSubmit() {
    if (this.studentForm.valid) {
      console.log('Dados do Estudante a salvar:', {
        originalId: this.studentId,
        ...this.studentForm.value
      });
      alert('Estudante atualizado com sucesso!');
      this.router.navigate(['/admin-dashboard']);
    }
  }
}