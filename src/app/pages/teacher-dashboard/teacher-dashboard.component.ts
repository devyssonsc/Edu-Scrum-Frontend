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
  
  selectedTab: string = 'Courses';
  tabs: string[] = ['Courses', 'Projects', 'Awards'];

  // Mock Data: Courses 
  coursesData = [
    { code: 'QS', name: 'Software Quality', degree: 'Computer Engineering', ects: 6, students: 75, projects: 1 },
    { code: 'IA', name: 'Artificial Intelligence', degree: 'Computer Engineering', ects: 6, students: 75, projects: 2 },
    { code: 'E', name: 'Entrepreneurship', degree: 'International Relations', ects: 4, students: 59, projects: 1 }
  ];

  // Mock Data: Projects 
  projectsData = [
    { name: 'Final Project 2024', course: 'Software Quality', startDate: '2024-09-15', endDate: '2024-12-20' },
    { name: 'Intelligent Agents', course: 'Artificial Intelligence', startDate: '2024-10-01', endDate: '2024-11-30' }
  ];

  // Mock Data: Awards 
  private fullAwardsData = [
    { name: 'Fast Hands', type: 'Global', points: 50, isOwner: false }, 
    { name: 'Best Bug Report', type: 'Course', points: 100, isOwner: true }
  ];

  currentData: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentData = this.coursesData;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
    
    if (tab === 'Courses') {
      this.currentData = this.coursesData;
    } else if (tab === 'Projects') {
      this.currentData = this.projectsData;
    } else if (tab === 'Awards') {
      this.currentData = this.fullAwardsData.map(award => ({
        name: award.name,
        type: award.type,
        points: award.points
      }));
    }
  }

  handleRowClick(row: any) {
    if (this.selectedTab === 'Courses') {
      console.log('Navigate to course:', row.code);
      this.router.navigate(['/teacher-dashboard/course', row.code]);
    
    } else if (this.selectedTab === 'Projects') {
      console.log('Navigate to project:', row.name);
    
    } else if (this.selectedTab === 'Awards') {
      const originalAward = this.fullAwardsData.find(a => a.name === row.name);
      
      if (originalAward && originalAward.isOwner) {
        console.log('Permission granted: Delete/Edit award', row.name);
      } else {
        alert('You can only manage awards created by you.');
      }
    }
  }
}