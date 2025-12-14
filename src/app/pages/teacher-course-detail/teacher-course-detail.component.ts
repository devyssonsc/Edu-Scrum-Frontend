import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Course, Project, StudentLite } from '../../services/dataService'; 
import { AuthService } from '../../services/authService';

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
  private authService = inject(AuthService);
  private role = "TEACHER";

  courseId: number | null = null; 
  course: Course | undefined;
  
  projectsView: any[] = [];
  
  realStudentCount: number = 0;

  constructor() {}

  ngOnInit() {
    if(!this.authService.checkRole(this.role)){
      return
    }
    const rawId = this.route.snapshot.paramMap.get('id');
    
    if (rawId) {
      this.courseId = Number(rawId);
      this.loadCourseData(this.courseId);
    }
  }

  loadCourseData(id: number) {
    // 1. Carrega dados básicos do curso
    this.dataService.getCourseById(id).subscribe((data: Course | undefined) => {
      this.course = data;
    });

    // 2. Carrega Projetos (para o card de Projetos)
    this.dataService.getProjectsByCourseId(id).subscribe((data: any) => {
      this.projectsView = data.map((p: Project) => ({
        id: p.id, 
        name: p.name,
        startDate: p.startDate,
        endDate: p.endDate,
        teams: p.teamsCount
      }));
    });

    // 3. Carrega Alunos (para o card de Estudantes Inscritos)
    this.dataService.getCourseStats(id).subscribe((res: any) => {
        this.realStudentCount = res.studentsCount;
    });
  }

  handleProjectClick(row: any) {
    this.router.navigate(['/teacher-dashboard/project', row.id]);
  }

  handleDeleteProject(row: any) {
    if(confirm(`Are you sure you want to delete project "${row.name}"?`)) {
      this.dataService.deleteProject(row.name).subscribe(success => {
        if(success && this.courseId) {
           this.loadCourseData(this.courseId);
        }
      });
    }
  }

  createProject() {
    if (!this.course || !this.courseId) return;
    
    this.router.navigate(
      ['/teacher-dashboard/course', this.courseId, 'create-project'],
      { state: { courseName: this.course.name } }
    );
  }
}