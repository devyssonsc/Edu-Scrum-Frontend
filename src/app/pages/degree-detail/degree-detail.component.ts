import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component'; 
import { DataService } from '../../services/dataService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { AuthService } from '../../services/authService';

@Component({
  selector: 'app-degree-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './degree-detail.component.html',
  styleUrl: './degree-detail.component.scss'
})
export class DegreeDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private role = "ADMIN";

  coursesArray: any
  degreeForm: FormGroup;
  degreeId: number | null = null;
  degreeName: string = '';

  stats = {
    studentsCount: 0, 
    teachersCount: 0,    
    coursesCount: 0      
  };

  constructor(private httpClient: HttpClient) {
    this.degreeForm = this.fb.group({
      name: ['', Validators.required],
      cadeiras: this.fb.array([]) 
    });
  }

  ngOnInit() {
    if(!this.authService.checkRole(this.role)){
      return
    }
    const routeParam = this.route.snapshot.paramMap.get('id');
    
    if (routeParam) {
        const parsedId = Number(routeParam);
        
        if (!isNaN(parsedId)) {
            this.degreeId = parsedId;
            this.loadDataById(this.degreeId);
        } else {
            console.error('Invalid Degree ID provided via route');
            this.router.navigate(['/admin-dashboard']);
        }
    }
  }

  loadDataById(id: number) {
    this.dataService.getDegreeById(id).subscribe(degree => {
      this.dataService.getDegreeStats(id).subscribe((response:any) => {
        if (degree) {
            this.stats.coursesCount = response.coursesCount
            this.stats.studentsCount = response.studentsCount
            this.stats.teachersCount = response.teachersCount

            this.degreeName = degree.name;
            this.degreeForm.patchValue({ name: degree.name });
            this.loadCourses(id);
        }
    });
    });
  }

  loadCourses(degreeId: number) {
    this.coursesArray = this.degreeForm.get('cadeiras') as FormArray;
    this.coursesArray.clear();

    this.dataService.getCoursesByDegreeId(degreeId).subscribe(courses => {
        console.log(courses);
        courses.forEach(c => {
            const group = this.fb.group({
                id: [c.id],
                name: [c.name, Validators.required]
            });
            this.coursesArray.push(group);
        });
    });
  }

  get cadeiras() {
    return this.degreeForm.get('cadeiras') as FormArray;
  }

  moveToCoursePage(index: number){

    const courseGroup = this.coursesArray.at(index) as FormGroup;
    const courseId = courseGroup.get('id')?.value;

    this.router.navigate(['/admin-dashboard/course', courseId]); 
  }
  removeCadeira(index: number) {
    this.cadeiras.removeAt(index);
    this.degreeForm.markAsDirty(); 
  }

  onSubmit() {
    if (this.degreeForm.valid && this.degreeId) {
      
      const newName = this.degreeForm.value.name;

      this.httpClient.put(`${enviroments.apiUrl}/degrees/${this.degreeId}`, 
        {
          name: newName
        }).subscribe((response: any) => {
              console.log('Resposta do servidor:', response);
      });
    
    }
  }
}