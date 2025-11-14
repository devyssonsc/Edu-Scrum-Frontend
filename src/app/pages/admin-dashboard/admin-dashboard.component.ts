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

  data: any[] = this.degrees;
  
  constructor(private router: Router) {}


  selectedOption: string = 'Cursos';

  // Getter que retorna as chaves (nomes das colunas) com base no primeiro elemento
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
    }
  }

    onAddClick() {
    if (this.selectedOption === 'Cursos') {
      this.router.navigate(['/admin-dashboard/register-degree']);
    
    } else if (this.selectedOption === 'Cadeiras') {
      this.router.navigate(['/admin-dashboard/register-course']);
    
    } else if (this.selectedOption === 'Estudantes') {
      //Quando criar a componente para adicionar estudantes
      console.log('Navegar para registar estudante');
    
    } else if (this.selectedOption === 'Professores') {
      //Quando criar a componente para adicionar professores
      console.log('Navegar para registar professor');
    }
  }
}
