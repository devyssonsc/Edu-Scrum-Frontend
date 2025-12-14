import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Course } from '../../services/dataService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { AuthService } from '../../services/authService';

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
  private authService = inject(AuthService);
  private role = "TEACHER";
  private router = inject(Router);

  awardForm: FormGroup;
  myCourses: Course[] = [];

  constructor(private httpClient: HttpClient) {
    this.awardForm = this.fb.group({
      scope: ['', Validators.required],
      courseId: [null, Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit() {
    this.authService.checkRole(this.role);
    this.dataService.getCoursesByTeacher(localStorage.getItem("id")).subscribe(courses => {
      this.myCourses = courses;
    });
  }

  onSubmit() {
    if (this.awardForm.valid) {
      const formValue = this.awardForm.value;
      const courseId = Number(formValue.courseId)

      const payload = {
        scope: formValue.scope,
        name: formValue.name,
        description: formValue.description,
        points: Number(formValue.points),
      };

      console.log(payload)
      this.httpClient.post(`${enviroments.apiUrl}/courses/${courseId}/awards`, payload).subscribe((response: any) => {
        console.log('Resposta do servidor:', response);
        alert('The Award was successfully registered.');
        this.router.navigate(['/teacher-dashboard'], { queryParams: { tab: 'Awards' }})
      });

      
    } else {
      this.awardForm.markAllAsTouched();
    }
  }
}