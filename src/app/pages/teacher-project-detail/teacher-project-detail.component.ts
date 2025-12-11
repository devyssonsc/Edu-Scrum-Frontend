import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Project, Team, StudentLite, CreateTeamRequest } from '../../services/dataService';

@Component({
  selector: 'app-teacher-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, ReactiveFormsModule],
  templateUrl: './teacher-project-detail.component.html',
  styleUrl: './teacher-project-detail.component.scss'
})
export class TeacherProjectDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);

  project: Project | undefined;
  teams: Team[] = [];
  availableStudents: StudentLite[] = [];

  showCreateTeamForm = false;
  teamForm: FormGroup;
  selectedStudentId = new FormControl<number | null>(null);

  constructor() {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      members: this.fb.array([], Validators.minLength(1))
    });
  }

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (projectId) {
      this.loadData(projectId);
    }
  }

  loadData(projectId: number) {
    this.dataService.getProjectById(projectId).subscribe(p => {
      this.project = p;

      if (p && p.courseId) {
        this.loadStudents(p.courseId);
      }
    });

    this.dataService.getTeamsByProject(projectId).subscribe(t => {
      this.teams = t;
    });
  }

  loadStudents(courseId: number) {
    this.dataService.getStudentsByCourseId(courseId).subscribe((students: StudentLite[]) => {
      this.availableStudents = students;
    });
  }

  get members() {
    return this.teamForm.get('members') as FormArray;
  }

  toggleCreateForm() {
    this.showCreateTeamForm = !this.showCreateTeamForm;
    if (!this.showCreateTeamForm) {
      this.teamForm.reset();
      this.members.clear();
    }
  }

  addMemberToForm() {
    const studentId = Number(this.selectedStudentId.value);
    if (!studentId) return;

    const student = this.availableStudents.find(s => s.id === studentId);
    if (!student) return;

    const isAlreadyInForm = this.members.controls.some(ctrl => ctrl.value.student.id === student.id);
    
    if (!isAlreadyInForm) {
      const memberGroup = this.fb.group({
        student: [student], 
        role: ['DEVELOPER', Validators.required] 
      });
      
      this.members.push(memberGroup);
      this.selectedStudentId.reset();
    } else {
      alert('Student already added to the list.');
    }
  }

  removeMemberFromForm(index: number) {
    this.members.removeAt(index);
  }

  onSubmitTeam() {
    if (this.teamForm.valid && this.project) {
      const formValue = this.teamForm.value;
      
      const payload: CreateTeamRequest = {
        name: formValue.name,
        projectId: this.project.id,
        members: formValue.members.map((m: any) => ({
          studentId: m.student.id,
          teamRole: m.role
        }))
      };

      this.dataService.createTeam(payload).subscribe({
        next: (success) => {
          if (success) {
            alert(`Team "${payload.name}" created successfully!`);
            this.toggleCreateForm();
            this.loadData(this.project!.id); 
          }
        },
        error: (err) => {
          if (err.status === 409) {
            alert('Conflict: One or more students are already in a team for this project.');
          } else {
            console.error(err);
            alert('An error occurred while creating the team.');
          }
        }
      });
    } else {
      this.teamForm.markAllAsTouched();
    }
  }
}