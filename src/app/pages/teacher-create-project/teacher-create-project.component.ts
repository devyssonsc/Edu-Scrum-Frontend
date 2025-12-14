
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Course } from '../../services/dataService';
import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/authService';

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
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private role = "TEACHER";

  projectForm: FormGroup;
  courseId: number | null = null; 
  courseName: string = '';

  today = new Date().toISOString().split('T')[0];
  constructor(private httpClient: HttpClient) {
this.projectForm = this.fb.group(
  {
    name: ['', Validators.required],
    startDate: ['', [Validators.required, this.startDateAfterTodayValidator]],
    endDate: ['', Validators.required],
    description: ['']
  },
  {
    validators: this.endDateAfterStartDateValidator
  }
);
  }

    startDateAfterTodayValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(control.value);

  return startDate >= today
    ? null
    : { startDateBeforeToday: true };
};

endDateAfterStartDateValidator = (group: AbstractControl): ValidationErrors | null => {
  const startDate = group.get('startDate')?.value;
  const endDate = group.get('endDate')?.value;

  if (!startDate || !endDate) return null;

  return new Date(endDate) > new Date(startDate)
    ? null
    : { endDateBeforeStartDate: true };
};

  ngOnInit() {
    this.authService.checkRole(this.role);
    const rawId = this.route.snapshot.paramMap.get('courseId');

    const state = history.state;
    if (state && state.courseName) {
      this.courseName = state.courseName;
    }

    if (rawId) {
      this.courseId = Number(rawId);

      if (!this.courseName && !isNaN(this.courseId)) {

        this.dataService.getCourseById(this.courseId).subscribe((c: Course | undefined) => {
          this.courseName = c ? c.name : 'Unknown Course';
        });
      }
    }
  }

  onSubmit() {
    if (this.projectForm.valid && this.courseId) {
      const start = new Date(this.projectForm.value.startDate);
      const end = new Date(this.projectForm.value.endDate);

      if (end <= start) {
        alert('End date must be after start date.');
        return;
      }
      const newProject = {
        name: this.projectForm.value.name,
        courseId: this.courseId,
        startDate: this.projectForm.value.startDate,
        endDate: this.projectForm.value.endDate,
        description: this.projectForm.value.description
      };
      
      console.log('Formulário Válido:', this.projectForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/courses/${newProject.courseId}/projects`, newProject).subscribe((response: any) => {
      console.log("Resposta do Servidor:" + response)

       this.dataService.createProject(newProject).subscribe((success: boolean) => {
         if (success) {
           alert('Project created successfully!');

           this.router.navigate(['/teacher-dashboard/course', this.courseId]);
         }

       });
    });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}