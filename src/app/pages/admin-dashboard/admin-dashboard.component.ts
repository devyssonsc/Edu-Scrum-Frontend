import { Component, OnInit } from '@angular/core';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  
  // --- DADOS MOCKADOS ---
  degrees = [
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    }
  ];

  cadeiras = [
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      students: 52
    }
  ];

  students = [
    {
      num: 50440,
      name: "Tiago Silva",
      email: "50440@alunos.upt.pt",
      degree: "Engenharia Informática"
    },
    {
      num: 50441,
      name: "David Aroso",
      email: "50441@alunos.upt.pt",
      degree: "Engenharia Informática"
    }
  ];

  teachers = [
    {
      name: "Fátima Leal",
      email: "fatimal@upt.pt",
      courses: 3
    },
    {
      name: "Bruno Cunha",
      email: "Bruninho@upt.pt",
      courses: 4
    }
  ];

  data: any[] = this.degrees;
  selectedOption: string = 'Cursos';
  
  constructor(private router: Router) {}


  get columns(): string[] {
    if (!this.degrees || this.degrees.length === 0) return [];
    return Object.keys(this.degrees[0]);
  }

  onSelectOption(event: any) {
    console.log(event);
    this.selectedOption = event;

    if(this.selectedOption === 'Cursos') {
      this.data = this.degrees;
    } else if(this.selectedOption === 'Cadeiras') {
      this.data = this.cadeiras;
    } else if(this.selectedOption === 'Estudantes') {
      this.data = this.students;
    } else if(this.selectedOption === 'Professores'){
      this.data = this.teachers;
    }
  }

  onAddClick() {
    if (this.selectedOption === 'Cursos') {
      this.router.navigate(['/admin-dashboard/register-degree']);
    
    } else if (this.selectedOption === 'Cadeiras') {
      this.router.navigate(['/admin-dashboard/register-course']);
    
    } else if (this.selectedOption === 'Estudantes') {
      this.router.navigate(['/admin-dashboard/register-student']);
    
    } else if (this.selectedOption === 'Professores') {
      this.router.navigate(['/admin-dashboard/register-teacher']);
    }
  }

  handleEdit(row: any) {
    if (this.selectedOption === 'Cursos') {
      this.router.navigate(['/admin-dashboard/degree', row.code]);
    
    } else if (this.selectedOption === 'Cadeiras') {
      this.router.navigate(['/admin-dashboard/course', row.code]);
    
    } else if (this.selectedOption === 'Estudantes') {

      console.log('A navegar para estudante:', row.num);
      this.router.navigate(['/admin-dashboard/student', row.num]);

    } else if (this.selectedOption === 'Professores') {

      console.log('A editar professor:', row.email);
      this.router.navigate(['/admin-dashboard/teacher', row.email]);
      
    } else {
      console.log('Edição ainda não implementada para:', this.selectedOption);
    }
  }
}