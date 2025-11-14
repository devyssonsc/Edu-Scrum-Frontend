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
  degrees = [
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    },
    {
      code: "EI",
      name: "Engenharia Informática",
      courses: 17,
      teachers: 9,
      students: 217
    }
  ]

  cadeiras = [
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    },
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    },
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    },
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    },
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    },
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    },
    {
      code: "QS",
      name: "Qualidade de Software",
      degree: "Engenharia Informática",
      ects: 6,
      students: 52
    }
  ]
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
  ]
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
  ]

  data: any[] = this.degrees;
  
  constructor(private router: Router) {}


  selectedOption: string = 'Cursos';

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
      this.router.navigate(['/admin-dashboard/register-student'])
    
    } else if (this.selectedOption === 'Professores') {
      //Quando criar a componente para adicionar professores
      console.log('Navegar para registar professor');
    }
  }
}
