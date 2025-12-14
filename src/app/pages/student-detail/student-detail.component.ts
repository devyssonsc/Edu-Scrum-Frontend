import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, StudentLite, Degree, Course } from '../../services/dataService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { AuthService } from '../../services/authService';


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
  private authService = inject(AuthService);
  private role = "STUDENT";

  studentForm: FormGroup;
  studentId: number | null = null;
  studentName: string = '';
  allDegrees: Degree[] = [];
  
  availableCoursesToAdd: Course[] = [];
  selectedCourseId = new FormControl<number | null>(null); 

  constructor(private httpClient: HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      degreeId: [null, Validators.required],
      courses: this.fb.array([]) 
    });
  }

  ngOnInit() {
    if(!this.authService.checkRole(this.role)){
      return
    }
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
    this.dataService.getDegrees().subscribe(degrees => {
      this.allDegrees = degrees;
    });
    this.dataService.getStudentById(id).subscribe((student: StudentLite | undefined) => {
      if (student) {
        this.studentName = student.name;

        console.log(student)
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          degreeId: student.degreeId 
        });
        

        if (student.degreeId) {
            this.loadStudentCourses(student.degreeId, student.courseIds || []);
        }

        this.loadCourses();
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
      });}

      
    loadCourses() {
      const coursesArray = this.studentForm.get('courses') as FormArray;
      coursesArray.clear();

      this.dataService.getCoursesByStudent(this.studentId).subscribe(enrollments => {
      enrollments.forEach(c => {
      const group = this.fb.group({
        name: [c.name]
      });
      coursesArray.push(group);
    });
  });
  }

  get courses() {
    return this.studentForm.get('courses') as FormArray;
  }

  // --- AÇÕES ---

  addCourse() {
    const courseId = Number(this.selectedCourseId.value);
    if(confirm('Are you sure you want to add this course?')){
      if (courseId && this.studentId) {

        this.httpClient.post(`${enviroments.apiUrl}/courses/${courseId}/students/${this.studentId}`, {}).subscribe(r => {
          console.log('Resposta do servidor:', r);
            //Refresh the page to update Courses
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
          });
        }


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

      this.httpClient.put(`${enviroments.apiUrl}/users/students/${this.studentId}`, payload).subscribe((response: any) => {
        console.log('Resposta do servidor:', response);
      });

      
    }
  }
}