import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Course } from '../../services/dataService';

@Component({
  selector: 'app-teacher-create-award',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-create-award.component.html',
  styleUrl: './teacher-create-award.component.scss'
})
export class TeacherCreateAwardComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  awardForm: FormGroup;
  myCourses: Course[] = [];

  constructor() {
    this.awardForm = this.fb.group({
      courseId: [null, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    this.dataService.getCourses().subscribe(courses => {
      this.myCourses = courses;
    });
  }

  onSubmit() {
    if (this.awardForm.valid) {
      const formValue = this.awardForm.value;
      
      const payload = {
        name: formValue.name,
        description: formValue.description,
        points: Number(formValue.points),
        courseId: Number(formValue.courseId)
      };

      this.dataService.createAward(payload).subscribe(success => {
        if (success) {
          alert('Award created successfully!');
          this.router.navigate(['/teacher-dashboard'], { queryParams: { tab: 'Awards' } });
        } else {
          alert('Error creating award.');
        }
      });
    } else {
      this.awardForm.markAllAsTouched();
    }
  }
}