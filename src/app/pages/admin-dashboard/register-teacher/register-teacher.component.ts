import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Precisamos de FormArray e minLength
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

// Interface para a Cadeira
interface Course {
  id: number;
  code: string;
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

  private fb = inject(FormBuilder);
  teacherForm: FormGroup;
  showCourseList = false; // Controla a visibilidade da lista de seleção

  // 1. DADOS MOCKADOS: Todas as cadeiras do sistema
  allCourses: Course[] = [
    { id: 1, code: 'QS', name: 'Qualidade de Software' },
    { id: 2, code: 'IA', name: 'Inteligência Artificial' },
    { id: 3, code: 'PWEB', name: 'Prog. Web' },
    { id: 4, code: 'BD', name: 'Bases de Dados' },
    { id: 5, code: 'SO', name: 'Sistemas Operativos' }
  ];

  constructor() {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // 2. Criamos o FormArray com o validador minLength(1)
      courses: this.fb.array([], [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void { }

  // 3. Getter para aceder facilmente ao FormArray no HTML
  get courses() {
    return this.teacherForm.get('courses') as FormArray;
  }

  // 4. Cria o FormGroup para uma cadeira selecionada
  newCourse(course: Course): FormGroup {
    return this.fb.group({
      id: [course.id],
      code: [course.code],
      name: [course.name]
    });
  }

  // 5. Adiciona uma cadeira da lista (se já não estiver adicionada)
  addCourse(course: Course) {
    // Verifica se a cadeira já foi adicionada
    const alreadyAdded = this.courses.controls.some(control => control.value.id === course.id);
    
    if (!alreadyAdded) {
      this.courses.push(this.newCourse(course));
    }
    this.showCourseList = false; // Esconde a lista após selecionar
  }

  // 6. Remove uma cadeira da lista
  removeCourse(index: number) {
    this.courses.removeAt(index);
  }

  // 7. Mostra/Esconde a lista de seleção
  toggleCourseList() {
    this.showCourseList = !this.showCourseList;
  }

  // 8. Submissão
  onSubmit() {
    if (this.teacherForm.valid) {
      console.log('Formulário Válido (Teacher):', this.teacherForm.value);
      // ...chamar serviço...
    } else {
      console.log('Formulário Inválido');
      this.teacherForm.markAllAsTouched();
    }
  }
}