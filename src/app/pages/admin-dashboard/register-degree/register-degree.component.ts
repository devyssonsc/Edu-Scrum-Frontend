import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms'; 

interface AvailableCourse {
  id: number;
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
  degreeForm: FormGroup;
  
  isSubmitted = false;

  allCourses: AvailableCourse[] = [
    { id: 1, code: 'IA', name: 'Inteligência Artificial' },
    { id: 2, code: 'QS', name: 'Qualidade de Software' },
    { id: 3, code: 'PWEB', name: 'Programação Web' },
    { id: 4, code: 'BD', name: 'Bases de Dados' },
    { id: 5, code: 'SO', name: 'Sistemas Operativos' }
  ];

  selectedCourseId = new FormControl<number | null>(null, Validators.required);
  newCourseEcts = new FormControl('', [
    Validators.required, 
  ]);
  
  showAddInputs = false;

  constructor() {
    this.degreeForm = this.fb.group({
      nome: ['', Validators.required],
      cadeiras: this.fb.array([], Validators.minLength(1)) 
    });
  }

  ngOnInit(): void {
  }

  get cadeiras() {
    return this.degreeForm.get('cadeiras') as FormArray;
  }

  newCadeiraGroup(code: string, name: string, ects: any): FormGroup {
    return this.fb.group({
      code: [code],
      name: [name],
      ects: [ects]
    });
  }

  showAddCourseFields() {
    this.selectedCourseId.reset(null);
    this.newCourseEcts.reset('');
    this.showAddInputs = true;
  }

  cancelAddCourse() {
    this.showAddInputs = false;
  }

  confirmAddCourse() {
    this.selectedCourseId.markAsTouched();
    this.newCourseEcts.markAsTouched();

    if (this.selectedCourseId.invalid || this.newCourseEcts.invalid) {
      return;
    }
    
    const courseId = Number(this.selectedCourseId.value);
    const selectedCourse = this.allCourses.find(c => c.id === courseId);
    const ectsValue = this.newCourseEcts.value;

    if (!selectedCourse) return;

    const isDuplicate = this.cadeiras.controls.some(control => 
      control.value.code === selectedCourse.code
    );

    if (isDuplicate) {
      this.selectedCourseId.setErrors({ 'duplicate': true });
    } else {
      this.cadeiras.push(this.newCadeiraGroup(selectedCourse.code, selectedCourse.name, ectsValue));
      this.cancelAddCourse();
    }
  }

  removeCadeira(index: number) {
    this.cadeiras.removeAt(index);
  }

  onSubmit() {
    this.isSubmitted = true; 
    this.degreeForm.markAllAsTouched();
    
    if (this.degreeForm.valid) {
      console.log('Formulário Válido:', this.degreeForm.value);
    } else {
      console.log('Formulário Inválido');
    }
  }
}