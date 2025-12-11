import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { DataService, Degree } from '../../services/dataService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { forkJoin } from 'rxjs';

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
  selectedOption: string = 'Degrees';
  
  // Stats
  countDegrees = 0;
  countCourses = 0;
  countStudents = 0;
  countTeachers = 0;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getData();
  }

  getData(){
  //get all count Numbers
  this.httpClient.get<any>(`${enviroments.apiUrl}/stats/global`)
  .subscribe(res => {
    console.log("Status globais: ", res);
    this.countCourses = res.totalCourses;
    this.countStudents = res.totalStudents;
    this.countDegrees = res.totalDegrees;
    this.countTeachers = res.totalTeachers;
    this.loadAllData();
  });

  //get all Degrees & Stats
  this.httpClient.get<Degree[]>(`${enviroments.apiUrl}/degrees`)
    .subscribe({
      next: (degrees) => {

        // Criar array de observables (uma requisição por degree)
        const statsRequests = degrees.map(d =>
          this.httpClient.get(`${enviroments.apiUrl}/stats/degrees/${d.id}`)
        );

        // Fazer todas as requisições em paralelo
        forkJoin(statsRequests).subscribe({
          next: (statsArray: any[]) => {

            // Juntar degree + stats
            const mergedDegrees: Degree[] = degrees.map((degree, index) => ({
              ...degree,
              coursesCount: statsArray[index].coursesCount,
              teachersCount: statsArray[index].teachersCount,
              studentsCount: statsArray[index].studentsCount
            }));

            // Enviar para o dataService
            this.dataService.setDegrees(mergedDegrees);
            this.loadAllData();
          },
          error: (err) => {
            console.error('Erro ao carregar estatísticas:', err);
          }
        });
      },

      error: (err) => {
        console.error('Erro ao carregar degrees:', err);
      }
    });


    
}
  

  loadAllData() {
    // 1. Degrees
    this.dataService.getDegrees().subscribe(res => {
      this.degrees = res.map(d => ({
        id: d.id, 
        Name: d.name,
        Courses: d.coursesCount,
        Teachers: d.teachersCount,
        Students: d.studentsCount
      }));
      if (this.selectedOption === 'Degrees') this.data = this.degrees;
    });

    // 2. Courses
    this.dataService.getCourses().subscribe(res => {
      this.courses = res.map(c => ({
        id: c.id,
        Name: c.name,
        Degree: c.degreeName || 'N/A',
        Students: c.studentsCount
      }));
      if (this.selectedOption === 'Courses') this.data = this.courses;
    });

    // 3. Students
    this.dataService.getStudents().subscribe(res => {
      this.students = res.map(s => ({
        id: s.id,
        Number: s.studentNumber, 
        Name: s.name,
        Email: s.email
      }));
      if (this.selectedOption === 'Students') this.data = this.students;
    });

    // 4. Teachers
    this.dataService.getTeachers().subscribe(res => {
      this.teachers = res.map(t => ({
        id: t.id,
        Name: t.name,
        Email: t.email,
        Courses: t.coursesCount
      }));
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

  // --- EDIT LOGIC ---
  handleEdit(row: any) {

    if (this.selectedOption === 'Degrees') {
      this.router.navigate(['/admin-dashboard/degree', row.id]); 
    
    } else if (this.selectedOption === 'Courses') {
      this.router.navigate(['/admin-dashboard/course', row.id]); 
    
    } else if (this.selectedOption === 'Students') {

      this.router.navigate(['/admin-dashboard/student', row.id]);
    
    } else if (this.selectedOption === 'Teachers') {
      this.router.navigate(['/admin-dashboard/teacher', row.id]);
    }
  }

  // --- DELETE LOGIC ---
  handleDelete(row: any) {
    const confirmMessage = `Are you sure you want to delete: ${row.Name}?`;
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