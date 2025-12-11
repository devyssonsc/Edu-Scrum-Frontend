import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component'; 
import { DataService } from '../../services/dataService';

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

  degreeForm: FormGroup;
  degreeId: number | null = null;
  degreeName: string = '';

  stats = {
    studentsCount: 0, 
    teachersCount: 0,    
    coursesCount: 0      
  };

  constructor() {
    this.degreeForm = this.fb.group({
      name: ['', Validators.required],
      cadeiras: this.fb.array([]) 
    });
  }

  ngOnInit() {
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
        if (degree) {
            this.stats.studentsCount = degree.studentsCount || 0;
            this.stats.teachersCount = degree.teachersCount || 0;
            this.stats.coursesCount = degree.coursesCount || 0;

            this.degreeName = degree.name;

            this.degreeForm.patchValue({ name: degree.name });
            this.loadCourses(id);
        }
    });
  }

  loadCourses(degreeId: number) {
    const cadeirasArray = this.degreeForm.get('cadeiras') as FormArray;
    cadeirasArray.clear();

    this.dataService.getCoursesByDegreeId(degreeId).subscribe(courses => {
        courses.forEach(c => {
            const group = this.fb.group({
                name: [c.name, Validators.required]
            });
            cadeirasArray.push(group);
        });
    });
  }

  get cadeiras() {
    return this.degreeForm.get('cadeiras') as FormArray;
  }

  removeCadeira(index: number) {
    this.cadeiras.removeAt(index);
    this.degreeForm.markAsDirty(); 
  }

  onSubmit() {
    if (this.degreeForm.valid && this.degreeId) {
      
      const newName = this.degreeForm.value.name;

      this.dataService.updateDegree(this.degreeId, { name: newName }).subscribe(success => {
        if (success) {
            alert('Degree updated successfully!');
            this.router.navigate(['/admin-dashboard']);
        } else {
            alert('Error updating degree.');
        }
      });
    }
  }
}