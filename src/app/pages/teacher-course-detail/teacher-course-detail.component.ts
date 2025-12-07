import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';

@Component({
  selector: 'app-teacher-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ShowTableComponent, StatsCardComponent],
  templateUrl: './teacher-course-detail.component.html',
  styleUrl: './teacher-course-detail.component.scss'
})
export class TeacherCourseDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseId: string | null = null;

  // DADOS MOCKADOS (Simula a cadeira "Qualidade de Software")
  courseData = {
    code: 'QS',
    name: 'Qualidade de Software',
    degree: 'Engenharia Informática',
    stats: {
      totalStudents: 75,
      activeProjects: 1,
      totalTeams: 12
    },
    projects: [
      { name: 'Projeto Final 2024', startDate: '2024-09-15', endDate: '2024-12-20', teams: 12 },
      { name: 'Mini-Projeto Testes', startDate: '2024-10-01', endDate: '2024-10-30', teams: 12 }
    ]
  };

  constructor() {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
  }
  handleProjectClick(row: any) {
    console.log('Abrir projeto:', row.name);
  }

  createProject() {
    console.log('Criar novo projeto para:', this.courseId);
    this.router.navigate(['/teacher-dashboard/course', this.courseId, 'create-project']);
  }
}