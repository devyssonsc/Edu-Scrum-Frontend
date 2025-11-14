import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms'; 

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
  mockCadeiras: Cadeira[] = [
    { code: 'IA', name: 'Inteligência Artificial' },
    { code: 'QS', name: 'Qualidade de Software' }
  ];

  constructor() {
    this.courseForm = this.fb.group({
      nome: ['', Validators.required],
      cadeiras: this.fb.array([])
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

  addCadeira() {
    // Lógica real adiciono depois. Por agora, adicionei um mock.
    console.log("Adicionando nova cadeira...");
    this.cadeiras.push(this.newCadeira('TESTE', 'Nova Cadeira'));
  }

  removeCadeira(index: number) {
    this.cadeiras.removeAt(index);
  }
  onSubmit() {
    if (this.courseForm.valid) {
      console.log('Formulário Válido:', this.courseForm.value);
      // ...chamar serviço...
    } else {
      console.log('Formulário Inválido');
      this.courseForm.markAllAsTouched(); 
    }
  }
}