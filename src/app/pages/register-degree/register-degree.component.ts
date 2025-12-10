import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { DataService, Course } from '../../services/dataService';

@Component({
  selector: 'app-register-degree',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register-degree.component.html',
  styleUrl: './register-degree.component.scss'
})
export class RegisterDegreeComponent {
  
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  degreeForm: FormGroup;
  
  allCourses: Course[] = [];
  showAddInputs = false;
  selectedCourseId = new FormControl(null, [Validators.required]);
  isSubmitted = false;

  constructor() {
    this.degreeForm = this.fb.group({
      name: ['', Validators.required],
      courses: this.fb.array([], Validators.minLength(1)) 
    });

    this.dataService.getCourses().subscribe(data => {
      this.allCourses = data;
    });
  }

  get courses() {
    return this.degreeForm.get('courses') as FormArray;
  }

  showAddCourseFields() {
    this.showAddInputs = true;
    this.selectedCourseId.reset();
  }

  cancelAddCourse() {
    this.showAddInputs = false;
    this.selectedCourseId.reset();
  }

  confirmAddCourse() {
    if (this.selectedCourseId.valid && this.selectedCourseId.value) {
      const courseId = Number(this.selectedCourseId.value);
      const alreadyAdded = this.courses.controls.some(
        ctrl => ctrl.value.id === courseId
      );

      if (alreadyAdded) {
        this.selectedCourseId.setErrors({ duplicate: true });
        return;
      }

      const course = this.allCourses.find(c => c.id === courseId);
      if (course) {
        this.addCourseToForm(course);
        this.showAddInputs = false;
        this.selectedCourseId.reset();
      }
    }
  }

  addCourseToForm(course: Course) {
    const courseGroup = this.fb.group({
      id: [course.id],
      name: [course.name]
    });
    this.courses.push(courseGroup);
  }

  removecourse(index: number) {
    this.courses.removeAt(index);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.degreeForm.valid) {
      console.log('Degree Data:', this.degreeForm.value);
      alert('Degree registered successfully!'); 
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.degreeForm.markAllAsTouched();
    }
  }
}