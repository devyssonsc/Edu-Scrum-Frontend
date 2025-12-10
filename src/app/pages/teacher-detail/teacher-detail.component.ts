import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component'; 
import { DataService, Teacher, Course } from '../../services/dataService';

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
  private dataService = inject(DataService);

  teacherForm: FormGroup;
  teacherId: number | null = null; 

  stats = {
    coursesCount: 0
  };

  constructor() {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courses: this.fb.array([]) 
    });
  }

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    
    if (rawId) {
      this.teacherId = Number(rawId);
      if(!isNaN(this.teacherId)) {
        this.loadData(this.teacherId);
      } else {
        this.router.navigate(['/admin-dashboard']);
      }
    }
  }

  loadData(id: number) {
    this.dataService.getTeacherById(id).subscribe((teacher: Teacher | undefined) => {
      if (teacher) {
        
        this.stats.coursesCount = teacher.coursesCount;
        this.teacherForm.patchValue({
          name: teacher.name,
          email: teacher.email
        });
        
        this.loadTeacherCourses(teacher.courseIds);
      }
    });
  }

  loadTeacherCourses(courseIds: number[]) {
    const coursesArray = this.teacherForm.get('courses') as FormArray;
    coursesArray.clear();

    this.dataService.getCourses().subscribe(allCourses => {
        const teacherCourses = allCourses.filter(c => courseIds.includes(c.id));
        
        teacherCourses.forEach(c => {
            const group = this.fb.group({
                id: [c.id],
                name: [c.name]
            });
            coursesArray.push(group);
        });
        
        this.stats.coursesCount = teacherCourses.length;
    });
  }

  get courses() {
    return this.teacherForm.get('courses') as FormArray;
  }

  onSubmit() {
    if (this.teacherForm.valid && this.teacherId) {
      
      const payload = {
        name: this.teacherForm.value.name,
        email: this.teacherForm.value.email
      };

      this.dataService.updateTeacher(this.teacherId, payload).subscribe({
        next: (success) => {
          if (success) {
            alert('Teacher updated successfully!');
            this.router.navigate(['/admin-dashboard']);
          }
        },
        error: (err) => {
          if (err.status === 409) {
             alert('Error: This email is already assigned to another teacher.');
             this.teacherForm.get('email')?.setErrors({ 'duplicate': true });
          } else {
             alert('An error occurred while updating the teacher.');
          }
        }
      });
    }
  }
}