import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { DataService, Degree } from '../../services/dataService';

@Component({
  selector: 'app-register-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './register-student.component.html',
  styleUrl: './register-student.component.scss'
})
export class RegisterStudentComponent implements OnInit {

  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);

  studentForm: FormGroup;
  allDegrees: Degree[] = [];
  selectedDegreeId = new FormControl(null, [Validators.required]);

  constructor() {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      studentNumber: ['', Validators.required],
      degreeId: this.selectedDegreeId
    });
  }

  ngOnInit() {
    this.dataService.getDegrees().subscribe(data => {
      this.allDegrees = data;
    });
  }

  selectDegree() {
  }

  onSubmit() {
    if (this.studentForm.valid) {
      console.log('Student Data:', this.studentForm.value);
      alert('Student registered successfully!');
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.studentForm.markAllAsTouched();
    }
  }
}