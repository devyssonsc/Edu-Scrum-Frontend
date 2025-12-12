import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Award, Course, StudentLite, Team } from '../../services/dataService';

@Component({
  selector: 'app-teacher-award-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, StatsCardComponent],
  templateUrl: './teacher-award-detail.component.html',
  styleUrl: './teacher-award-detail.component.scss'
})
export class TeacherAwardDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);

  award: Award | undefined;
  awardId: number | null = null;

  // Form Variables
  showAssignForm = false;
  assignForm: FormGroup;
  
  // Data
  myCourses: Course[] = [];
  availableStudents: StudentLite[] = [];
  availableTeams: Team[] = [];

  constructor() {
    this.assignForm = this.fb.group({
      courseId: [null, Validators.required],
      recipientType: ['STUDENT', Validators.required],
      recipientId: [null, Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.awardId = Number(id);
      this.loadAwardData();
    }
    
    // Carregar cursos para o dropdown
    this.dataService.getCourses().subscribe(data => this.myCourses = data);
  }

  loadAwardData() {
    if (this.awardId) {
      this.dataService.getAwards().subscribe(allAwards => {
        this.award = allAwards.find(a => a.id === this.awardId);
        
        if (this.award?.courseId) {
          this.assignForm.patchValue({ courseId: this.award.courseId });
          this.onCourseChange(); 
        }
      });
    }
  }

  toggleAssignForm() {
    this.showAssignForm = !this.showAssignForm;
  }

  onCourseChange() {
    const courseId = Number(this.assignForm.get('courseId')?.value);
    if (courseId) {
      this.dataService.getStudentsByCourseId(courseId).subscribe(data => this.availableStudents = data);
      this.dataService.getTeamsByCourseId(courseId).subscribe(data => this.availableTeams = data);
      this.assignForm.patchValue({ recipientId: null });
    }
  }

  onTypeChange() {
    this.assignForm.patchValue({ recipientId: null });
  }

  onSubmitAssignment() {
    if (this.assignForm.valid && this.awardId) {
      const { courseId, recipientType, recipientId } = this.assignForm.value;
      const cId = Number(courseId);
      const rId = Number(recipientId);

      let request$;
      if (recipientType === 'STUDENT') {
        request$ = this.dataService.assignAwardToStudent(rId, this.awardId, cId);
      } else {
        request$ = this.dataService.assignAwardToTeam(rId, this.awardId, cId);
      }

      request$.subscribe(success => {
        if (success) {
          alert('Award assigned successfully!');
          this.toggleAssignForm();
          this.assignForm.get('recipientId')?.reset();
        } else {
          alert('Error assigning award.');
        }
      });
    } else {
      this.assignForm.markAllAsTouched();
    }
  }
} 