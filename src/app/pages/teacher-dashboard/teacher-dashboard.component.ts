import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { DataService, Award } from '../../services/dataService';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {

  private dataService = inject(DataService);
  private router = inject(Router);

  teacherName: string = 'Fátima Leal';

  // Data Holders
  courses: any[] = [];
  projects: any[] = [];
  awards: any[] = [];
  
  private rawAwards: Award[] = [];

  // Table Data
  data: any[] = [];
  selectedOption: string = 'Courses';

  // Stats
  countCourses = 0;
  countProjects = 0;

  constructor() {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    // 1. Courses
    this.dataService.getCourses().subscribe(res => {
      this.courses = res.map(c => ({
        id: c.id,
        Name: c.name,
        Degree: c.degreeName || 'N/A',
        Students: c.studentsCount,
        Projects: c.projectsCount
      }));
      
      this.countCourses = res.length;

      if (this.selectedOption === 'Courses') this.data = this.courses;
    });

    // 2. Projects
    this.dataService.getAllProjects().subscribe(res => {
      this.projects = res.map(p => ({
        id: p.id,
        Name: p.name,
        Course: p.courseName,
        Teams: p.teamsCount
      }));
      this.countProjects = res.length;
      if (this.selectedOption === 'Projects') this.data = this.projects;
    });

    // 3. Awards
    this.dataService.getAwards().subscribe(res => {
      this.rawAwards = res;
      this.awards = res.map(a => ({
        id: a.id,
        Name: a.name,
        Type: a.type,
        Points: a.points
      }));
      if (this.selectedOption === 'Awards') this.data = this.awards;
    });
  }

  onSelectOption(event: any) {
    this.selectedOption = event;
    this.refreshTable();
  }

  refreshTable() {
    if (this.selectedOption === 'Courses') {
      this.data = this.courses;
    } else if (this.selectedOption === 'Projects') {
      this.data = this.projects;
    } else if (this.selectedOption === 'Awards') {
      this.data = this.awards;
    }
  }

  // --- EDIT / NAVIGATION LOGIC ---
  
  handleEdit(row: any) {
    if (this.selectedOption === 'Courses') {
      this.router.navigate(['/teacher-dashboard/course', row.id]);
    
    } else if (this.selectedOption === 'Projects') {
      this.router.navigate(['/teacher-dashboard/project', row.id]);
    
    } else if (this.selectedOption === 'Awards') {
      this.handleAwardAction(row);
    }
  }

  // --- DELETE LOGIC ---

  handleDelete(row: any) {
    if (this.selectedOption === 'Courses') {
      alert('Teachers cannot delete Courses.');
      return;
    }

    const confirmMessage = `Are you sure you want to delete: ${row.Name}?`;
    if (!confirm(confirmMessage)) return;

    if (this.selectedOption === 'Projects') {
      this.dataService.deleteProject(row.Name).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Awards') {
      this.handleAwardDelete(row);
    }
  }

  postDeleteAction(success: boolean) {
    if (success) {
      this.loadAllData();
    } else {
      alert('Error deleting item.');
    }
  }

  handleAwardAction(row: any) {
    const originalAward = this.rawAwards.find(a => a.id === row.id || a.name === row.Name);
    if (originalAward && originalAward.isOwner) {
       alert('Edit award logic here');
    } else {
       alert('You can only manage awards created by you.');
    }
  }

  handleAwardDelete(row: any) {
    const originalAward = this.rawAwards.find(a => a.id === row.id || a.name === row.Name);
    if (originalAward && originalAward.isOwner) {
        this.dataService.deleteAward(originalAward.name).subscribe(success => this.postDeleteAction(success));
    } else {
        alert('You can only delete awards created by you.');
    }
  }
}