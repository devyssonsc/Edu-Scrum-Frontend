import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { DataService, StudentLite, Degree, Course } from '../../services/dataService';

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
  
  availableCoursesToAdd: Course[] = [];
  selectedCourseId = new FormControl<number | null>(null); 

  constructor() {
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

        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          degreeId: student.degreeId 
        });
        
        if (student.degreeId) {
            this.loadStudentCourses(student.degreeId, student.courseIds || []);
        }
      }
    });
  }

  loadStudentCourses(degreeId: number, enrolledCourseIds: number[]) {
    this.dataService.getCoursesByDegreeId(degreeId).subscribe(degreeCourses => {
        
        this.availableCoursesToAdd = degreeCourses.filter(c => !enrolledCourseIds.includes(c.id));

        const coursesArray = this.studentForm.get('courses') as FormArray;
        coursesArray.clear();

        const enrolledCourses = degreeCourses.filter(c => enrolledCourseIds.includes(c.id));

        enrolledCourses.forEach(c => {
            coursesArray.push(this.fb.group({
                id: [c.id], 
                name: [c.name],
                grade: ['---']
            }));
        });
    });
  }

  get courses() {
    return this.studentForm.get('courses') as FormArray;
  }

  // --- AÇÕES ---

  addCourse() {
    const courseId = Number(this.selectedCourseId.value);

    if (courseId && this.studentId) {

        this.dataService.addStudentToCourse(courseId, this.studentId).subscribe(success => {
            if (success) {
                this.loadData(this.studentId!);
                this.selectedCourseId.reset();
                this.selectedCourseId.setValue(null);
                this.studentForm.markAsDirty();
            } else {
                alert('Could not enroll student in this course.');
            }
        });
    }
  }

  removeCourse(index: number) {
    const courseGroup = this.courses.at(index);
    const courseId = courseGroup.value.id;

    if (this.studentId && courseId) {
        if(confirm('Unenroll student from this course?')) {
            this.dataService.removeStudentFromCourse(courseId, this.studentId).subscribe(success => {
                if (success) {
                    this.loadData(this.studentId!);
                    this.studentForm.markAsDirty();
                }
            });
        }
    }
  }

  onSubmit() {
    if (this.studentForm.valid && this.studentId) {
      
      const payload = {
        name: this.studentForm.value.name,
        email: this.studentForm.value.email,
        degreeId: Number(this.studentForm.value.degreeId)
      };

      this.dataService.updateStudent(this.studentId, payload).subscribe({
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
      });
    }
  }
}