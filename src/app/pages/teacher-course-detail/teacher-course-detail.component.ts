import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Course } from '../../services/dataService';

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
  private dataService = inject(DataService);

  courseId: string | null = null;
  course: Course | undefined;
  
  projectsView: any[] = [];

  constructor() {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    
    if (this.courseId) {
      this.loadCourseData(this.courseId);
    }
  }

  loadCourseData(code: string) {
    // 1. Obter detalhes da cadeira
    this.dataService.getCourseByCode(code).subscribe(data => {
      this.course = data;
    });

    // 2. Obter projetos e formatar para tabela
    this.dataService.getProjectsByCourse(code).subscribe(data => {
      this.projectsView = data.map(p => ({
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        teams: p.teamsCount
      }));
    });
  }

  handleProjectClick(row: any) {
    console.log('Open project:', row.name);
  }

  createProject() {
    if (!this.course) return;
    
    this.router.navigate(
      ['/teacher-dashboard/course', this.courseId, 'create-project'],
      { state: { courseName: this.course.name } }
    );
  }
}