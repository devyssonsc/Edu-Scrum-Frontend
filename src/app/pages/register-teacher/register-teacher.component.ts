import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { AuthService } from '../../services/authService';

interface Course {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register-teacher',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register-teacher.component.html',
  styleUrl: './register-teacher.component.scss'
})
export class RegisterTeacherComponent implements OnInit {
  private authService = inject(AuthService);
  private role = "ADMIN";

  private fb = inject(FormBuilder);
  teacherForm: FormGroup;
  isSubmitted = false;
  selectedCourseId = new FormControl<number | null>(null, Validators.required);
  showAddInputs = false;

  constructor(private httpClient: HttpClient) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      courses: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      password: [''],
      user_type: ['TEACHER'],  
      role: ['TEACHER']   
    });
  }

    ngOnInit(): void {
      if(!this.authService.checkRole(this.role)){
      return
    }
      this.loadCourses();
    }
  
    allCourses: Course[] = [];
    loadCourses() {
  
    this.httpClient.get<any[]>(`${enviroments.apiUrl}/courses`)
      .subscribe({
        next: (courses) => {
          this.allCourses = courses;  
        },
        error: (err) => {
          console.error('Erro ao carregar courses:', err);
        }
      });
  }

  get courses() {
    return this.teacherForm.get('courses') as FormArray;
  }

  newCourseGroup(name: string, id: number): FormGroup {
    return this.fb.group({
      name: [name],
      courseId: [id]
    });
  }

  showAddCourseFields() {
    this.selectedCourseId.reset(null);
    this.showAddInputs = true;
  }

  
  cancelAddCourse() {
    this.showAddInputs = false;
  }

  confirmAddCourse() {
    this.selectedCourseId.markAsTouched();

    if (this.selectedCourseId.invalid) {
      return;
    }
    
    const courseId = Number(this.selectedCourseId.value);
    const selectedCourse = this.allCourses.find(c => c.id === courseId);

    if (!selectedCourse) return;

    const isDuplicate = this.courses.controls.some(control => 
      control.value.name === selectedCourse.name
    );

    if (isDuplicate) {
      this.selectedCourseId.setErrors({ 'duplicate': true });
    } else {
      this.courses.push(this.newCourseGroup(selectedCourse.name, selectedCourse.id));
      this.cancelAddCourse();
    }
  }

  removecourse(index: number) {
    this.courses.removeAt(index);
  }

  generatePassword(){
      const firstName = this.teacherForm.value.name.trim().split(' ')[0];
      this.teacherForm.value.password = firstName + "12345"
  }

  onSubmit() {

    this.generatePassword();

    this.isSubmitted = true; 
    this.teacherForm.markAllAsTouched();
    
    if (this.teacherForm.valid) {
      console.log('Formulário Válido:', this.teacherForm.value);
      this.httpClient.post(`${enviroments.apiUrl}/users`, this.teacherForm.value).subscribe((response: any) => {
        console.log('Resposta do servidor:', response);
        alert('The teacher was successfully registered.');

        this.courses.controls.forEach((course: any) => {
            this.httpClient.post(`${enviroments.apiUrl}/courses/${course.value.courseId}/teachers/${response.id}`, {}).subscribe(r => {
            console.log('Resposta do servidor:', r);
            })
        });
       },
         (err: HttpErrorResponse) => {
           if(err.status === 409) {
             alert('This Teacher Already Exists.');
           } else {
             alert(`An error has ocurred. Try again later.`);
           }
         });
    } else {
      console.log('Formulário Inválido');
    }
  }
}