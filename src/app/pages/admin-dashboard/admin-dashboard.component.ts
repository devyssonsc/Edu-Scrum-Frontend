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

  // Data Holders
  degrees: any[] = [];
  courses: any[] = [];
  students: any[] = [];
  teachers: any[] = [];

  // Table Data
  data: any[] = [];
  selectedOption: string = 'Cursos'; 
  
  // Stats
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
      if (this.selectedOption === 'Cursos') this.data = this.degrees;
    });

    // 2. Courses (Cadeiras)
    this.dataService.getCourses().subscribe(res => {
      this.courses = res.map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        degree: c.degreeName || 'N/A',
        students: c.studentsCount
      }));
      this.countCourses = res.length;
      if (this.selectedOption === 'Cadeiras') this.data = this.courses;
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
      if (this.selectedOption === 'Estudantes') this.data = this.students;
    });

    this.dataService.getTeachers().subscribe(res => {
      this.teachers = res;
      this.countTeachers = res.length;
      if (this.selectedOption === 'Professores') this.data = this.teachers;
    });
  }

  onSelectOption(event: any) {
    this.selectedOption = event;
    this.refreshTable();
  }

  refreshTable() {
    if(this.selectedOption === 'Cursos') {
      this.data = this.degrees;
    } else if(this.selectedOption === 'Cadeiras') {
      this.data = this.courses;
    } else if(this.selectedOption === 'Estudantes') {
      this.data = this.students;
    } else if(this.selectedOption === 'Professores'){
      this.data = this.teachers;
    }
  }

  onAddClick() {
    if (this.selectedOption === 'Cursos') {
      this.router.navigate(['/admin-dashboard/register-degree']);
    } else if (this.selectedOption === 'Cadeiras') {
      this.router.navigate(['/admin-dashboard/register-course']);
    } else if (this.selectedOption === 'Estudantes') {
      this.router.navigate(['/admin-dashboard/register-student']);
    } else if (this.selectedOption === 'Professores') {
      this.router.navigate(['/admin-dashboard/register-teacher']);
    }
  }

  handleEdit(row: any) {
    if (this.selectedOption === 'Cursos') {
      this.router.navigate(['/admin-dashboard/degree', row.code]); 
    } else if (this.selectedOption === 'Cadeiras') {
      this.router.navigate(['/admin-dashboard/course', row.code]); 
    } else if (this.selectedOption === 'Estudantes') {
      this.router.navigate(['/admin-dashboard/student', row.num]);
    } else if (this.selectedOption === 'Professores') {
      this.router.navigate(['/admin-dashboard/teacher', row.email]);
    }
  }

  // --- DELETE LOGIC ---
  
  handleDelete(row: any) {
    const confirmMessage = `Tem a certeza que deseja eliminar: ${row.name}?`;
    if (!confirm(confirmMessage)) return;

    if (this.selectedOption === 'Cursos') {
      this.dataService.deleteDegree(row.id).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Cadeiras') {
      this.dataService.deleteCourse(row.id).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Estudantes') {
      this.dataService.deleteStudent(row.id).subscribe(success => this.postDeleteAction(success));
    
    } else if (this.selectedOption === 'Professores') {
      this.dataService.deleteTeacher(row.id).subscribe(success => this.postDeleteAction(success));
    }
  }

  postDeleteAction(success: boolean) {
    if (success) {
      this.loadAllData(); 
    } else {
      alert('Erro ao eliminar elemento.');
    }
  }
}