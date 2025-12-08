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
  courseName: string = '';
  
  private coursesList = [
    { code: 'QS', name: 'Software Quality' },
    { code: 'IA', name: 'Artificial Intelligence' },
    { code: 'E', name: 'Entrepreneurship' }
  ];

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    
    const state = history.state;
    
    if (state && state.courseName) {
      this.courseName = state.courseName;
    } else {
      const foundCourse = this.coursesList.find(c => c.code === this.courseId);
      this.courseName = foundCourse ? foundCourse.name : (this.courseId || 'Course');
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const start = new Date(this.projectForm.value.startDate);
      const end = new Date(this.projectForm.value.endDate);

      if (end <= start) {
        alert('End date must be after start date.');
        return;
      }

      console.log('Creating Project for course:', this.courseName);
      console.log('Project Data:', this.projectForm.value);
      
      alert('Project created successfully!');
      this.router.navigate(['/teacher-dashboard/course', this.courseId]);
    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}