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
    this.dataService.getCourseByCode(code).subscribe(data => {
      this.course = data;
    });

    this.dataService.getProjectsByCourse(code).subscribe(data => {
      this.projectsView = data.map(p => ({
      
        id: p.id, 
        
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        teams: p.teamsCount
      }));
    });
  }

  handleProjectClick(row: any) {
    // CORREÇÃO: Navegar para a página de detalhe usando o ID do projeto
    console.log('Navigating to project:', row.id);
    this.router.navigate(['/teacher-dashboard/project', row.id]);
  }

  handleDeleteProject(row: any) {
    if(confirm(`Are you sure you want to delete project "${row.name}"?`)) {
      this.dataService.deleteProject(row.name).subscribe(success => {
        if(success) {
          if (this.courseId) this.loadCourseData(this.courseId);
        }
      });
    }
  }

  createProject() {
    if (!this.course) return;
    
    this.router.navigate(
      ['/teacher-dashboard/course', this.courseId, 'create-project'],
      { state: { courseName: this.course.name } }
    );
  }
}