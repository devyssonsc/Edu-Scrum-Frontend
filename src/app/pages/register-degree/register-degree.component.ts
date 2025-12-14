import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms'; 
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { AuthService } from '../../services/authService';

interface Course {
  id: number;
  code: string;
  name: string;
}

interface DegreeResponse {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register-degree',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-degree.component.html',
  styleUrl: './register-degree.component.scss'
})
export class RegisterDegreeComponent implements OnInit {
  private authService = inject(AuthService);
  private role = "ADMIN";

  private fb = inject(FormBuilder);
  degreeForm: FormGroup;
  newCourseName = this.fb.control('', Validators.required);
  showAddInput = false;
  isSubmitted = false;

  selectedCourseId = new FormControl<number | null>(null, Validators.required);
  
  constructor(private httpClient: HttpClient) {
    this.degreeForm = this.fb.group({
      name: ['', Validators.required],
      courses: this.fb.array([], Validators.minLength(0)) 
    });
  }

  ngOnInit(): void {
    this.authService.checkRole(this.role);
  }

  get courses() {
    return this.degreeForm.get('courses') as FormArray;
  }

  newCourseGroup(name: string): FormGroup {
    return this.fb.group({
      name: [name],
    });
  }

   addCourse() {
    const name = this.newCourseName.value?.trim();

    this.courses.push(this.fb.control(name));

    this.newCourseName.reset();
    this.showAddInput = false;
  }

  removeCourse(index: number) {
    this.courses.removeAt(index);
  }

  onSubmit() {
    this.isSubmitted = true; 
    this.degreeForm.markAllAsTouched();

    if (this.degreeForm.valid) {
      
      const newCourses = this.degreeForm.value.courses

      delete this.degreeForm.value.courses
      console.log('Formulário Válido:', this.degreeForm.value);
      this.httpClient.post<DegreeResponse>(`${enviroments.apiUrl}/degrees`, this.degreeForm.value).subscribe(response => {
          console.log('Resposta do servidor:', response);
          alert('The Degree was successfully registered.');

          newCourses.forEach((courseName: String) => {
            this.httpClient.post(`${enviroments.apiUrl}/degrees/${response.id}/courses`, {
            degreeId: response.id,
            name: courseName
          }).subscribe(r => console.log("Course criado:", r));
        });
      },
        (err: HttpErrorResponse) => {
          if(err.status === 409) {
            alert('This Degree Already Exists.');
          } else {
            alert(`An error has ocurred. Try again later.`);
          }
        });
    } else {
      console.log('Formulário Inválido');
    }
  }
}