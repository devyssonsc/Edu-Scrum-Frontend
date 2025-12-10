import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Course } from '../../services/dataService';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, ReactiveFormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);

  courseForm: FormGroup;
  courseId: number | null = null;
  courseName: string = '';

  mockCourseData = {
    stats: {
      studentsCount: 0,
      teachersCount: 0
    }
  };

  constructor() {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      degree: ['', Validators.required],
      teachers: this.fb.array([])
    });
  }

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    
    if (rawId) {
      this.courseId = Number(rawId);
      if (!isNaN(this.courseId)) {
        this.loadCourseData(this.courseId);
      } else {
        this.router.navigate(['/admin-dashboard']);
      }
    }
  }

  loadCourseData(id: number) {
    this.dataService.getCourseById(id).subscribe((data: Course | undefined) => {
      if (data) {
        this.courseName = data.name;

        this.mockCourseData.stats.studentsCount = data.studentsCount || 0;
        
        this.courseForm.patchValue({
          name: data.name,
          degree: data.degreeName 
        });
      }
    });
  }

  get teachers() {
    return this.courseForm.get('teachers') as FormArray;
  }

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Update course logic here...');
      this.router.navigate(['/admin-dashboard']);
    }
  }
}