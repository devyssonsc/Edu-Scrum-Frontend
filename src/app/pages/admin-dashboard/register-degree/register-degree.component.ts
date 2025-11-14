import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms'; 

interface Cadeira {
  code: string;
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

  private fb = inject(FormBuilder);
  courseForm: FormGroup;
  
  
  newCourseCode = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(2),
    Validators.pattern('^[a-zA-Z]+$')
  ]);
  newCourseName = new FormControl('', Validators.required);
  showAddInputs = false;

  mockCadeiras: Cadeira[] = [
    { code: 'IA', name: 'Inteligência Artificial' },
    { code: 'QS', name: 'Qualidade de Software' }
  ];

  constructor() {
    this.courseForm = this.fb.group({
      nome: ['', Validators.required],
      cadeiras: this.fb.array([], Validators.minLength(1)) 
    });
  }

  ngOnInit(): void {
    this.mockCadeiras.forEach(cadeira => {
      this.cadeiras.push(this.newCadeira(cadeira.code, cadeira.name));
    });
  }

  get cadeiras() {
    return this.courseForm.get('cadeiras') as FormArray;
  }

  newCadeira(code: string, name: string): FormGroup {
    return this.fb.group({
      code: [code],
      name: [name]
    });
  }

  showAddCourseFields() {
    this.newCourseCode.reset('');
    this.newCourseName.reset('');
    this.showAddInputs = true;
  }

  cancelAddCourse() {
    this.showAddInputs = false;
  }

  confirmAddCourse() {
    this.newCourseCode.markAsTouched();
    this.newCourseName.markAsTouched();

    if (this.newCourseCode.invalid || this.newCourseName.invalid) {
      return;
    }
    
    const newCode = this.newCourseCode.value?.toUpperCase() || '';
    const newName = this.newCourseName.value || 'N/A';

    const isDuplicate = this.cadeiras.controls.some(control => 
      control.value.code.toUpperCase() === newCode
    );

    if (isDuplicate) {
      this.newCourseCode.setErrors({ 'duplicate': true });
    } else {
      this.cadeiras.push(this.newCadeira(newCode, newName));
      this.cancelAddCourse();
    }
  }

  removeCadeira(index: number) {
    this.cadeiras.removeAt(index);
  }

  onSubmit() {
    this.courseForm.markAllAsTouched(); 
    if (this.courseForm.valid) {
      console.log('Formulário Válido:', this.courseForm.value);
    } else {
      console.log('Formulário Inválido');
    }
  }
}