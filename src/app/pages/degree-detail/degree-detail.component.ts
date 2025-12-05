import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component'; 

@Component({
  selector: 'app-degree-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './degree-detail.component.html',
  styleUrl: './degree-detail.component.scss'
})
export class DegreeDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  degreeForm: FormGroup;
  courseId: string | null = null;
  
  mockDegreeData = {
    code: 'EI',
    name: 'Engenharia Informática',
    stats: {
      studentsCount: 217, 
      teachersCount: 15,    
      coursesCount: 30      
    },
    cadeiras: [
      { code: 'IA', name: 'Inteligência Artificial' },
      { code: 'QS', name: 'Qualidade de Software' },
      { code: 'BD', name: 'Bases de Dados' },
      { code: 'PWEB', name: 'Programação Web' }
    ]
  };

  constructor() {
    this.degreeForm = this.fb.group({
      name: ['', Validators.required],
      cadeiras: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
  
    if (this.courseId) {
      this.loadData();
    }
  }

  loadData() {
    this.degreeForm.patchValue({ name: this.mockDegreeData.name });
    

    const cadeirasArray = this.degreeForm.get('cadeiras') as FormArray;
    cadeirasArray.clear();

    this.mockDegreeData.cadeiras.forEach(c => {
      const group = this.fb.group({
        code: [c.code, Validators.required],
        name: [c.name, Validators.required]
      });
      cadeirasArray.push(group);
    });
  }


  get cadeiras() {
    return this.degreeForm.get('cadeiras') as FormArray;
  }


  removeCadeira(index: number) {
    this.cadeiras.removeAt(index);
    this.degreeForm.markAsDirty(); 
  }

  onSubmit() {
    if (this.degreeForm.valid) {
      console.log('Dados a salvar:', {
        originalCode: this.courseId,
        newName: this.degreeForm.value.name,
        cadeiras: this.degreeForm.value.cadeiras
      });
      
    
      alert('Alterações guardadas!');
      this.router.navigate(['/admin-dashboard']);
    }
  }
}