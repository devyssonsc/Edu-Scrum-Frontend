import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { DataService } from '../../services/dataService';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  
  private dataService = inject(DataService);
  private router = inject(Router);

  degrees: any[] = [];
  courses: any[] = [];
  students: any[] = [];
  teachers: any[] = [];

  data: any[] = [];
  selectedOption: string = 'Degrees'; 
  
  countDegrees = 0;
  countCourses = 0;
  countStudents = 0;
  countTeachers = 0;

  constructor() {}

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    // 1. Degrees
    this.dataService.getDegrees().subscribe(res => {
      this.degrees = res;
      this.countDegrees = res.length;
      if (this.selectedOption === 'Degrees') this.data = this.degrees;
    });

    // 2. Courses
    this.dataService.getCourses().subscribe(res => {
      this.courses = res.map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        degree: c.degreeName || 'N/A',
        students: c.studentsCount
      }));
      this.countCourses = res.length;
      if (this.selectedOption === 'Courses') this.data = this.courses;
    });

    // 3. Students
    this.dataService.getStudents().subscribe(res => {
      this.students = res.map(s => ({
        id: s.id,
        num: s.studentNumber,
        name: s.name,
        email: s.email
      }));
      this.countStudents = res.length;
      if (this.selectedOption === 'Students') this.data = this.students;
    });

    // 4. Teachers
    this.dataService.getTeachers().subscribe(res => {
      this.teachers = res;
      this.countTeachers = res.length;
      if (this.selectedOption === 'Teachers') this.data = this.teachers;
    });
  }

  onSelectOption(event: any) {
    this.selectedOption = event;
    this.refreshTable();
  }

  refreshTable() {
    if(this.selectedOption === 'Degrees') {
      this.data = this.degrees;
    } else if(this.selectedOption === 'Courses') {
      this.data = this.courses;
    } else if(this.selectedOption === 'Students') {
      this.data = this.students;
    } else if(this.selectedOption === 'Teachers'){
      this.data = this.teachers;
    }
  }

  onAddClick() {
    if (this.selectedOption === 'Degrees') {
      this.router.navigate(['/admin-dashboard/register-degree']);
    } else if (this.selectedOption === 'Courses') {
      this.router.navigate(['/admin-dashboard/register-course']);
    } else if (this.selectedOption === 'Students') {
      this.router.navigate(['/admin-dashboard/register-student']);
    } else if (this.selectedOption === 'Teachers') {
      this.router.navigate(['/admin-dashboard/register-teacher']);
    }
  }

  handleEdit(row: any) {
    if (this.selectedOption === 'Degrees') {
      this.router.navigate(['/admin-dashboard/degree', row.code || row.id]); 
    } else if (this.selectedOption === 'Courses') {
      this.router.navigate(['/admin-dashboard/course', row.code]); 
    } else if (this.selectedOption === 'Students') {
      this.router.navigate(['/admin-dashboard/student', row.num]);
    } else if (this.selectedOption === 'Teachers') {
      this.router.navigate(['/admin-dashboard/teacher', row.id]);
    }
  }

  // --- DELETE LOGIC ---
  
  handleDelete(row: any) {
    const confirmMessage = `Are you sure you want to delete: ${row.name}?`;
    if (!confirm(confirmMessage)) return;

    if (this.selectedOption === 'Degrees') {
      this.dataService.deleteDegree(row.id).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Courses') {
      this.dataService.deleteCourse(row.id).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Students') {
      this.dataService.deleteStudent(row.id).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Teachers') {
      this.dataService.deleteTeacher(row.id).subscribe(success => this.postDeleteAction(success));
    }
  }

  postDeleteAction(success: boolean) {
    if (success) {
      this.loadAllData(); 
    } else {
      alert('Error deleting item.');
    }
  }
}