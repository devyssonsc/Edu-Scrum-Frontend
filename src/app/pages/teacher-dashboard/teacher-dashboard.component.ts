import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShowTableComponent } from '../../components/show-table/show-table.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ShowTableComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {

  teacherName = "Fátima Leal";
  
  selectedTab: string = 'Cadeiras';
  tabs: string[] = ['Cadeiras', 'Projetos', 'Prémios'];

  // Dados Mockados das Cadeiras
  coursesData = [
    { code: 'QS', name: 'Qualidade de Software', degree: 'Engenharia Informática', ects: 6, students: 75, projects: 1 },
    { code: 'IA', name: 'Inteligência Artificial', degree: 'Engenharia Informática', ects: 6, students: 75, projects: 2 },
    { code: 'E', name: 'Empreendedorismo', degree: 'Relações Internacionais', ects: 4, students: 59, projects: 1 }
  ];

  // Dados Mockados de Projetos
  projectsData = [
    { name: 'Projeto Final 2024', course: 'Qualidade de Software', startDate: '2024-09-15', endDate: '2024-12-20' },
    { name: 'Agentes Inteligentes', course: 'Inteligência Artificial', startDate: '2024-10-01', endDate: '2024-11-30' }
  ];

  // Dados Reais de Prémios
  private fullAwardsData = [
    { name: 'Fast Hands', type: 'Global', points: 50, isOwner: false },
    { name: 'Best Bug Report', type: 'Cadeira', points: 100, isOwner: true }
  ];

  currentData: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentData = this.coursesData;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    
    if (tab === 'Cadeiras') {
      this.currentData = this.coursesData;
    } else if (tab === 'Projetos') {
      this.currentData = this.projectsData;
    } else if (tab === 'Prémios') {
      this.currentData = this.fullAwardsData.map(award => ({
        name: award.name,
        type: award.type,
        points: award.points
      }));
    }
  }


  handleRowClick(row: any) {
    if (this.selectedTab === 'Cadeiras') {
      this.router.navigate(['/teacher-dashboard/course', row.code]);
    
    } else if (this.selectedTab === 'Projetos') {
      console.log('Navegar para projeto:', row.name);
    
    } else if (this.selectedTab === 'Prémios') {
      const originalAward = this.fullAwardsData.find(a => a.name === row.name);
      
      if (originalAward && originalAward.isOwner) {
        console.log('Permissão concedida: Eliminar/Editar prémio', row.name);
      } else {
        alert('Apenas pode gerir prémios criados por si.');
      }
    }
  }
}