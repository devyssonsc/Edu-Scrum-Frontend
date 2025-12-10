import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { DataService, Award } from '../../services/dataService';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, ShowTableComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {

  private dataService = inject(DataService);
  private router = inject(Router);

  teacherName = "Fátima Leal";
  
  selectedTab: string = 'Courses';
  tabs: string[] = ['Courses', 'Projects', 'Awards'];

  coursesView: any[] = [];
  projectsView: any[] = [];
  awardsView: any[] = [];
  
  private rawAwards: Award[] = [];
  currentData: any[] = [];

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    // 1. Cursos
    this.dataService.getCourses().subscribe(data => {
      this.coursesView = data.map(c => ({
        id: c.id, 
        name: c.name,
        degree: c.degree?.name,
        students: c.studentsCount,
        projects: c.projectsCount
      }));
      if (this.selectedTab === 'Courses') this.currentData = this.coursesView;
    });

    // 2. Projetos
    this.dataService.getAllProjects().subscribe(data => {
      this.projectsView = data.map(p => ({
        id: p.id, 
        name: p.name,
        course: p.courseName,
        startDate: p.startDate,
        endDate: p.endDate
      }));
      if (this.selectedTab === 'Projects') this.currentData = this.projectsView;
    });

    // 3. Prémios
    this.dataService.getAwards().subscribe(data => {
      this.rawAwards = data;
      this.awardsView = data.map(a => ({
        name: a.name,
        type: a.type,
        points: a.points
      }));
      if (this.selectedTab === 'Awards') this.currentData = this.awardsView;
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    
    if (tab === 'Courses') {
      this.currentData = this.coursesView;
    } else if (tab === 'Projects') {
      this.currentData = this.projectsView;
    } else if (tab === 'Awards') {
      this.currentData = this.awardsView;
    }
  }

  handleRowClick(row: any) {
    if (this.selectedTab === 'Courses') {
      console.log('Navigate to course:', row.id);
      this.router.navigate(['/teacher-dashboard/course', row.id]);
    
    } else if (this.selectedTab === 'Projects') {
      console.log('Navigate to project:', row.id);
      this.router.navigate(['/teacher-dashboard/project', row.id]);
    
    } else if (this.selectedTab === 'Awards') {
      this.handleAwardAction(row);
    }
  }

  handleAwardAction(row: any) {
    const originalAward = this.rawAwards.find(a => a.name === row.name);
    
    if (originalAward && originalAward.isOwner) {
      if(confirm('Do you want to delete this award?')) {
        this.dataService.deleteAward(originalAward.name).subscribe(success => {
          if(success) {
            alert('Award deleted');
            this.loadAllData();
          }
        });
      }
    } else {
      alert('You can only manage awards created by you.');
    }
  }

  handleDelete(row: any) {
    if (this.selectedTab === 'Projects') {
        if(confirm(`Are you sure you want to delete project "${row.name}"?`)) {
            this.dataService.deleteProject(row.name).subscribe(success => {
                if(success) {
                    this.loadAllData(); 
                }
            });
        }
    } 
    else if (this.selectedTab === 'Awards') {
        const originalAward = this.rawAwards.find(a => a.name === row.name);
        if (originalAward && originalAward.isOwner) {
            if(confirm(`Delete award "${row.name}"?`)) {
                this.dataService.deleteAward(row.name).subscribe(success => {
                    if(success) {
                        this.loadAllData();
                    }
                });
            }
        }
    }
  }
}