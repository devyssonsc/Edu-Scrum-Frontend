import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { ShowTableComponent } from '../../components/show-table/show-table.component';
import { Course, DataService, Degree, StudentLite, Teacher } from '../../services/dataService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatsCardComponent, SectionSelectorComponent, ShowTableComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private role = "ADMIN";
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

  pendingRequests: number = 0
  DataRequestsQuantity: number = 4

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.authService.checkRole(this.role);
    this.getData();
  }

  getData(){
  this.pendingRequests = this.DataRequestsQuantity

  //get all count Numbers
  this.httpClient.get<any>(`${enviroments.apiUrl}/stats/global`)
  .subscribe(res => {
    console.log("Status globais: ", res);
    this.countCourses = res.totalCourses;
    this.countStudents = res.totalStudents;
    this.countDegrees = res.totalDegrees;
    this.countTeachers = res.totalTeachers;
  });

  //get all Degrees & Stats
  this.httpClient.get<Degree[]>(`${enviroments.apiUrl}/degrees`)
    .subscribe({
      next: (degrees) => {

        //Bug Fix for empty lists
        if (degrees.length === 0) {
          this.dataService.setDegrees([]);
          this.pendingRequests--;
          if (this.pendingRequests === 0) {
            this.loadAllData();
          }
          return;
        }

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
            this.pendingRequests--;
            if (this.pendingRequests === 0) {
                this.loadAllData();
            }
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



  //get all Courses & Stats
  this.httpClient.get<Course[]>(`${enviroments.apiUrl}/courses`)
    .subscribe({
      next: (courses) => {
        
        //Bug Fix for empty lists
        if (courses.length === 0) {
          this.dataService.setCourses([]);
          this.pendingRequests--;
          if (this.pendingRequests === 0) {
            this.loadAllData();
          }
          return;
        }

        // Criar array de observables (uma requisição por course)
        const statsRequests = courses.map(c =>
          this.httpClient.get(`${enviroments.apiUrl}/stats/courses/${c.id}`)
        );

        // Fazer todas as requisições em paralelo
        forkJoin(statsRequests).subscribe({
          next: (statsArray: any[]) => {

            // Juntar degree + stats
            const mergedCourses: Course[] = courses.map((course, index) => ({
              ...course,
              degreeName: statsArray[index].degreeName,
              teachersCount: statsArray[index].teachersCount,
              studentsCount: statsArray[index].studentsCount
            }));

            // Enviar para o dataService
            this.dataService.setCourses(mergedCourses);
            this.pendingRequests--;
            if (this.pendingRequests === 0) {
                this.loadAllData();
            }
          },
          error: (err) => {
            console.error('Erro ao carregar estatísticas:', err);
          }
        });
      },

      error: (err) => {
        console.error('Erro ao carregar courses:', err);
      }
    });

    //get all Students
    this.httpClient.get<StudentLite[]>(`${enviroments.apiUrl}/users/students`)
    .subscribe({
      next: (students) => {

        if (students.length === 0) {
          this.dataService.setStudents([]);
          this.pendingRequests--;
          if (this.pendingRequests === 0) {
            this.loadAllData();
          }
          return;
        }

        this.dataService.setStudents(students); 
        this.pendingRequests--;
        if (this.pendingRequests === 0) {
           this.loadAllData();
          }
      },
      error: (err) => {
        console.error('Erro ao carregar Students:', err);
      }
    });

    //get all Teachers
      this.httpClient.get<Teacher[]>(`${enviroments.apiUrl}/users/teachers`)
    .subscribe({
      next: (teachers) => {
        
        //Bug fix for Empty Lists
        if (teachers.length === 0) {
          this.dataService.setTeachers([]);
          this.pendingRequests--;
          if (this.pendingRequests === 0) {
            this.loadAllData();
          }
          return;
        }

        // Criar array de observables (uma requisição por course)
        const statsRequests = teachers.map(t =>
          this.httpClient.get(`${enviroments.apiUrl}/stats/teachers/${t.id}`)
        );

        // Fazer todas as requisições em paralelo
        forkJoin(statsRequests).subscribe({
          next: (statsArray: any[]) => {

            // Juntar degree + stats
            const mergedTeachers: Teacher[] = teachers.map((teacher, index) => ({
              ...teacher,
              coursesCount: statsArray[index].coursesCount,
            }));

            // Enviar para o dataService
            this.dataService.setTeachers(mergedTeachers);
            this.pendingRequests--;
            if (this.pendingRequests === 0) {
                this.loadAllData();
            }
          },
          error: (err) => {
            console.error('Erro ao carregar estatísticas:', err);
          }
        });
      },

      error: (err) => {
        console.error('Erro ao carregar courses:', err);
      }
    });

}
  loadAllData() {
    // 1. Degrees
    this.dataService.getDegreesAdmin().subscribe(res => {
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
    this.dataService.getCoursesAdmin().subscribe(res => {
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
        Name: s.name,
        Email: s.email
      }));
      if (this.selectedOption === 'Students') this.data = this.students;
    });

    // 4. Teachers (AI Generated method)
    this.dataService.getTeachers().subscribe((res: any[]) => {
    // Cria um array de Observables para cada professor
    const statsObservables = res.map(t =>
    this.dataService.getTeacherStats(t.id)
    );

    // Executa todas as requisições em paralelo
    forkJoin(statsObservables).subscribe((statsArray: any[]) => {
      this.teachers = res.map((t, index) => ({
        id: t.id,
        Name: t.name,
        Email: t.email,
        Courses: statsArray[index].coursesCount  // pega o coursesCount correspondente
      }));

      if (this.selectedOption === 'Teachers') this.data = this.teachers;
    });
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