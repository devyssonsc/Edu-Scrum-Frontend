import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component'; 
import { DataService, StudentLite } from '../../services/dataService';

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
  private dataService = inject(DataService);

  studentForm: FormGroup;
  studentId: number | null = null;
  studentName: string = ''
  mockStats = {
    ectsCompleted: 120,
    avgGrade: 15.2,
    enrolledCourses: 6
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
    const rawId = this.route.snapshot.paramMap.get('id');
    
    if (rawId) {
      this.studentId = Number(rawId);
      if (!isNaN(this.studentId)) {
        this.loadData(this.studentId);
      } else {
        this.router.navigate(['/admin-dashboard']);
      }
    }
  }

  loadData(id: number) {
    this.dataService.getStudentById(id).subscribe((student: StudentLite | undefined) => {
      if (student) {
        this.studentName = student.name;

        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          degree: 'Computer Engineering' 
        });
        this.loadMockCourses();
      }
    });
  }

  loadMockCourses() {
    const coursesArray = this.studentForm.get('courses') as FormArray;
    coursesArray.clear();

    const mockEnrollments = [
      { code: 'QS', name: 'Software Quality', grade: '---' }, 
      { code: 'IA', name: 'Artificial Intelligence', grade: '16' },
      { code: 'PWEB', name: 'Web Programming', grade: '14' }
    ];

    mockEnrollments.forEach(c => {
      const group = this.fb.group({
        code: [c.code],
        name: [c.name],
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
      console.log('Update student logic here...', this.studentForm.value);
      this.router.navigate(['/admin-dashboard']);
    }
  }
}