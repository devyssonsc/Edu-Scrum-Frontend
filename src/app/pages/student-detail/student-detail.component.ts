import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, StudentLite, Degree } from '../../services/dataService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  studentName: string = '';
  allDegrees: Degree[] = [];

  constructor(private httpClient: HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      degreeId: [null, Validators.required],
      courses: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.dataService.getDegrees().subscribe(degrees => {
      this.allDegrees = degrees;
    });

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

        console.log(student)
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          degreeId: student.degreeId 
        });
        
        this.loadMockCourses();
      }
    });
  }

  loadMockCourses() {
    const coursesArray = this.studentForm.get('courses') as FormArray;
    coursesArray.clear();

    const mockEnrollments = [
      { name: 'Software Quality', grade: '---' }, 
      { name: 'Artificial Intelligence', grade: '16' },
      { name: 'Web Programming', grade: '14' }
    ];

    mockEnrollments.forEach(c => {
      const group = this.fb.group({
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
    if (this.studentForm.valid && this.studentId) {
      
      const payload = {
        name: this.studentForm.value.name,
        email: this.studentForm.value.email,
        degreeId: Number(this.studentForm.value.degreeId)
      };

      this.httpClient.put(`${enviroments.apiUrl}/users/students/${this.studentId}`, payload).subscribe((response: any) => {
        console.log('Resposta do servidor:', response);
      });

      /* this.dataService.updateStudent(this.studentId, payload).subscribe({
        next: (success) => {
            if(success) {
                alert('Student updated successfully!');
                this.router.navigate(['/admin-dashboard']);
            }
        },
        error: (err) => {
            if (err.status === 409) {
                alert('Error: This email is already assigned to another student.');
                this.studentForm.get('email')?.setErrors({ 'duplicate': true });
            } else {
                alert('An error occurred while updating the student.');
            }
        }
      }); */
    }
  }
}