import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importar RouterLink
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { DataService, Degree } from '../../services/dataService';

@Component({
  selector: 'app-register-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Adicionar aqui
  templateUrl: './register-course.component.html',
  styleUrl: './register-course.component.scss'
})
export class RegisterCourseComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  courseForm: FormGroup;
  allDegrees: Degree[] = [];
  selectedDegreeId = new FormControl(null, [Validators.required]);

  constructor() {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      degreeId: this.selectedDegreeId
    });
  }

  ngOnInit() {
    this.dataService.getDegrees().subscribe(data => {
      this.allDegrees = data;
    });
  }

  selectDegree() {
    // Lógica extra se necessário ao selecionar grau
  }

  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Course Data:', this.courseForm.value);
      alert('Course registered successfully!');
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.courseForm.markAllAsTouched();
    }
  }
}