import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Course, Degree, Teacher } from '../../services/dataService';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, ReactiveFormsModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);

  courseForm: FormGroup;
  courseId: number | null = null;
  courseName: string = '';

  // Data Sources
  allDegrees: Degree[] = [];
  availableTeachersToAdd: Teacher[] = []; 
  currentTeachers: Teacher[] = [];        

  // Controls
  selectedTeacherId = new FormControl<number | null>(null);

  mockCourseData = {
    stats: {
      studentsCount: 0,
      teachersCount: 0
    }
  };

  constructor() {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      degreeId: [null, Validators.required],
      teachers: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.dataService.getDegrees().subscribe(degrees => {
      this.allDegrees = degrees;
    });

    const rawId = this.route.snapshot.paramMap.get('id');
    if (rawId) {
      this.courseId = Number(rawId);
      if (!isNaN(this.courseId)) {
        this.loadCourseData(this.courseId);
        this.loadTeachers(this.courseId);
      } else {
        this.router.navigate(['/admin-dashboard']);
      }
    }
  }

  loadCourseData(id: number) {
    this.dataService.getCourseById(id).subscribe((data: Course | undefined) => {
      if (data) {
        this.courseName = data.name;
        this.mockCourseData.stats.studentsCount = data.studentsCount || 0;
        
        this.courseForm.patchValue({
          name: data.name,
          degreeId: data.degree?.id
        });
      }
    });
  }

  loadTeachers(courseId: number) {
    // 1. Get Teachers ALREADY in the course
    this.dataService.getTeachersByCourseId(courseId).subscribe(teachers => {
        this.currentTeachers = teachers;
        this.mockCourseData.stats.teachersCount = teachers.length;
        
        const teachersArray = this.courseForm.get('teachers') as FormArray;
        teachersArray.clear();
        teachers.forEach(t => {
            teachersArray.push(this.fb.group({
                id: [t.id],
                name: [t.name],
                email: [t.email]
            }));
        });

        // 2. Get ALL teachers to calculate who is available to add
        this.dataService.getTeachers().subscribe(all => {
            const currentIds = this.currentTeachers.map(t => t.id);
            this.availableTeachersToAdd = all.filter(t => !currentIds.includes(t.id));
        });
    });
  }

  get teachers() {
    return this.courseForm.get('teachers') as FormArray;
  }

  // --- ACTIONS ---

  addTeacher() {
    const teacherId = Number(this.selectedTeacherId.value);
    
    if (teacherId && this.courseId) {
        this.dataService.addTeacherToCourse(this.courseId, teacherId).subscribe(success => {
            if (success) {
                this.loadTeachers(this.courseId!); 
                this.selectedTeacherId.reset();
                this.selectedTeacherId.setValue(null);
                
                // CORREÇÃO: Força o formulário a ficar "Dirty" para ativar o botão Save
                this.courseForm.markAsDirty();
            } else {
                alert('Could not add teacher.');
            }
        });
    }
  }

  removeTeacher(index: number) {
    const teacherGroup = this.teachers.at(index);
    const teacherId = teacherGroup.value.id;
    
    if (this.courseId && teacherId) {
        if(confirm('Remove this teacher from the course?')) {
            this.dataService.removeTeacherFromCourse(this.courseId, teacherId).subscribe(success => {
                if (success) {
                    this.loadTeachers(this.courseId!);
        
                    this.courseForm.markAsDirty();
                }
            });
        }
    }
  }

  onSubmit() {
    if (this.courseForm.valid && this.courseId) {
      const payload = {
        name: this.courseForm.value.name,
        degreeId: Number(this.courseForm.value.degreeId)
      };

      this.dataService.updateCourse(this.courseId, payload).subscribe(success => {
        if (success) {
          alert('Course updated successfully!');
          this.router.navigate(['/admin-dashboard']);
        } else {
          alert('Error updating course.');
        }
      });
    }
  }
}