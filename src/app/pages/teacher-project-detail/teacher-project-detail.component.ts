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

  // Form State
  showCreateTeamForm = false;
  teamForm: FormGroup;
  
  // Controls for the "Add Member" section
  selectedStudentId = new FormControl<number | null>(null);

  constructor() {
    // Form initializes empty. Members are added via button.
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      members: this.fb.array([], Validators.minLength(1)) // At least 1 member required
    });
  }

  ngOnInit() {
    // Get Project ID from URL
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (projectId) {
      this.loadData(projectId);
    }
  }

  loadData(projectId: number) {
    // 1. Load Project Details
    this.dataService.getProjectById(projectId).subscribe(p => {
      this.project = p;
      if (p && p.courseCode) {
        // 2. Load Students from the Course (for the dropdown)
        this.loadStudents(p.courseCode);
      }
    });

    // 3. Load Teams associated with this Project
    this.dataService.getTeamsByProject(projectId).subscribe(t => {
      this.teams = t;
    });
  }

  loadStudents(courseCode: string) {
    this.dataService.getStudentsByCourse(courseCode).subscribe(students => {
      this.availableStudents = students;
    });
  }

  // --- Form Getters & Helpers ---

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

    // Check if student is already added to THIS form
    const isAlreadyInForm = this.members.controls.some(ctrl => ctrl.value.student.id === student.id);
    
    if (!isAlreadyInForm) {
      const memberGroup = this.fb.group({
        student: [student], // Store full object for UI display
        role: ['DEVELOPER', Validators.required] // Default role
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

  // --- Submit Logic ---

  onSubmitTeam() {
    if (this.teamForm.valid && this.project) {
      
      // Prepare Payload (DTO)
      const formValue = this.teamForm.value;
      
      // Transform form data to match backend expectations (IDs and Enums)
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
            this.loadData(this.project!.id); // Refresh grid
          }
        },
        error: (err) => {
          // Handle 409 Conflict (Business Rule: Student already in a team)
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