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

  assignmentHistory: any[] = []; 
  assignmentsCount: number = 0;

  // Forms
  editForm: FormGroup;
  assignForm: FormGroup;
  showAssignForm = false;
  myCourses: Course[] = [];
  availableStudents: StudentLite[] = [];
  availableTeams: Team[] = [];

  constructor() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      points: [1, [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    this.assignForm = this.fb.group({
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
    
    this.dataService.getCourses().subscribe(data => this.myCourses = data);
  }

  loadAwardData() {
    if (this.awardId) {
      this.dataService.getAwards().subscribe(allAwards => {
        this.award = allAwards.find(a => a.id === this.awardId);
        
        if (this.award) {
          this.editForm.patchValue({
            name: this.award.name,
            description: this.award.description,
            points: this.award.points
          });

          if (this.award.courseId) {
            this.loadContextData(this.award.courseId);
          }

          this.loadMockHistory();
        }
      });
    }
  }

  loadContextData(courseId: number) {
    this.dataService.getStudentsByCourseId(courseId).subscribe(data => this.availableStudents = data);
    this.dataService.getTeamsByCourseId(courseId).subscribe(data => this.availableTeams = data);
  }

  loadMockHistory() {
    this.assignmentHistory = [
      { id: 1, recipientId: 1, recipientName: 'Tiago Silva', type: 'STUDENT' }, 
      { id: 2, recipientId: 101, recipientName: 'Alpha Team', type: 'TEAM' }
    ];
    this.assignmentsCount = this.assignmentHistory.length;
  }

  toggleAssignForm() {
    this.showAssignForm = !this.showAssignForm;
  }

  onTypeChange() {
    this.assignForm.patchValue({ recipientId: null });
  }

  onSaveEdit() {
    if (this.editForm.valid && this.awardId) {
      this.dataService.updateAward(this.awardId, this.editForm.value).subscribe(success => {
        if (success) {
          alert('Award updated successfully!');
          this.loadAwardData();
        } else {
          alert('Error updating award. You might not have permission.');
        }
      });
    }
  }

  onSubmitAssignment() {
    if (this.assignForm.valid && this.award && this.award.courseId) {
      const { recipientType, recipientId } = this.assignForm.value;
      const rId = Number(recipientId);
      const cId = this.award.courseId;

      let request$;
      if (recipientType === 'STUDENT') {
        request$ = this.dataService.assignAwardToStudent(rId, this.award.id, cId);
      } else {
        request$ = this.dataService.assignAwardToTeam(rId, this.award.id, cId);
      }

      request$.subscribe(success => {
        if (success) {
          alert('Award assigned successfully!');
          this.toggleAssignForm();
          this.assignForm.get('recipientId')?.reset();
          
          const recipientName = recipientType === 'STUDENT' 
            ? this.availableStudents.find(s => s.id === rId)?.name 
            : this.availableTeams.find(t => t.id === rId)?.name;


          this.assignmentHistory.push({
            id: Math.floor(Math.random() * 1000),
            recipientId: rId, 
            recipientName: recipientName || 'Unknown',
            type: recipientType
          });
          this.assignmentsCount = this.assignmentHistory.length;
        } else {
          alert('Error assigning award.');
        }
      });
    } else {
      this.assignForm.markAllAsTouched();
    }
  }

  deleteAssignment(id: number) {
    if(confirm('Are you sure you want to revoke this award assignment?')) {
        this.assignmentHistory = this.assignmentHistory.filter(h => h.id !== id);
        this.assignmentsCount = this.assignmentHistory.length;
    }
  }
}