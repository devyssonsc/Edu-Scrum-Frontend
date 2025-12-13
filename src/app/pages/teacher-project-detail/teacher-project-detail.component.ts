import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, FormsModule, Validators, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';

import { HttpClient } from '@angular/common/http';
import { enviroments } from '../../../enviroments/enviroments';
import { DataService, Project, Team, StudentLite, CreateTeamRequest, Sprint, Award } from '../../services/dataService';

// --- VALIDADOR DE DATAS ---
const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const start = control.get('startDate')?.value;
  const end = control.get('endDate')?.value;

  if (start && end && new Date(start) > new Date(end)) {
    return { dateRangeInvalid: true };
  }
  return null;
};

@Component({
  selector: 'app-teacher-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, ReactiveFormsModule, FormsModule],
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

  // --- FORMULÁRIOS ---
  showCreateTeamForm = false;
  teamForm: FormGroup;
  selectedStudentId = new FormControl<number | null>(null);

  isEditingProject = false;
  editProjectForm: FormGroup;

  addingToTeamId: number | null = null;
  selectedStudentToAdd: number | null = null;

  showSprintModal = false;
  selectedTeam: Team | null = null;

  // --- AWARDS LOGIC ---
  showAwardModal = false;
  availableAwards: Award[] = [];
  selectedAwardId: number | null = null;
  
  targetType: 'TEAM' | 'STUDENT' | null = null;
  targetId: number | null = null;
  targetName: string = '';

  constructor(private httpClient: HttpClient) {
   
    this.teamForm = this.fb.group({
      number:['0', Validators.required],
      name: ['', Validators.required],
      members: this.fb.array([], [Validators.minLength(3)]) 
    }, { validators: this.teamRolesValidator });

    this.editProjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    }, { validators: dateRangeValidator }); 
  }
  teamRolesValidator(group: AbstractControl): ValidationErrors | null {
    const membersArray = group.get('members') as FormArray;
    if (!membersArray || membersArray.length === 0) return null;
    const roles = membersArray.controls.map(ctrl => ctrl.value.role);
    const smCount = roles.filter(r => r === 'SCRUM_MASTER').length;
    const poCount = roles.filter(r => r === 'PRODUCT_OWNER').length;
    const devCount = roles.filter(r => r === 'DEVELOPER').length;
    const errors: any = {};
    if (smCount !== 1) errors.invalidSM = true;
    if (poCount !== 1) errors.invalidPO = true;
    if (devCount < 1) errors.invalidDev = true;
    return Object.keys(errors).length > 0 ? errors : null;
  }

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (projectId) { this.loadData(projectId); }
  }

  loadData(projectId: number) {
    this.dataService.getProjectById(projectId).subscribe(p => {
      this.project = p;
      
      if (this.project) {
        this.editProjectForm.patchValue({
          name: this.project.name,
          description: this.project.description,
          startDate: this.project.startDate,
          endDate: this.project.endDate
        });
        if (p?.courseId) {
            this.loadStudents(p.courseId);
            this.dataService.getAwardsByCourse(p.courseId).subscribe(awards => {
                this.availableAwards = awards;
            });
        }
      }
    });
    this.dataService.getTeamsByProject(projectId).subscribe(t => { this.teams = t; });
  }

  loadStudents(courseId: number) {
    this.dataService.getStudentsByCourseId(courseId).subscribe(s => this.availableStudents = s);
  }

  get members() { return this.teamForm.get('members') as FormArray; }

  // ==========================================
  // 1. EDIÇÃO DE PROJETO
  // ==========================================
  toggleEditProject() {
    this.isEditingProject = !this.isEditingProject;
    
    if (this.isEditingProject && this.project) {
        this.editProjectForm.patchValue({
            name: this.project.name,
            description: this.project.description,
            startDate: this.project.startDate,
            endDate: this.project.endDate
        });
    }
  }

  saveProject() {
    if (this.editProjectForm.valid && this.project) {
        this.dataService.updateProject(this.project.id, this.editProjectForm.value).subscribe(success => {
            if (success) {
                this.isEditingProject = false;
                this.loadData(this.project!.id);
            } else {
                alert('Error updating project.');
            }
        });
    }
  }

  // ==========================================
  // 2. GESTÃO DE EQUIPAS
  // ==========================================

  deleteTeam(teamId: number) {
    if (confirm('Are you sure you want to delete this team entirely? This cannot be undone.')) {
        this.dataService.deleteTeam(teamId).subscribe(success => {
            if (success) {
                this.loadData(this.project!.id);
            }
        });
    }
  }

  removeMember(team: Team, studentId: number) {
    const member = team.members.find(m => m.student.id === studentId);
    if (member && member.role !== 'DEVELOPER') {
        alert('You can only remove Developers. Scrum Master and Product Owner are mandatory.');
        return;
    }

    if (confirm('Are you sure you want to remove this member from the team?')) {
        this.dataService.removeTeamMember(team.id, studentId).subscribe(success => {
            if (success) {
                this.loadData(this.project!.id);
            }
        });
    }
  }

  startAddMember(teamId: number) {
    this.addingToTeamId = teamId;
    this.selectedStudentToAdd = null;
  }

  confirmAddMember(teamId: number) {
    if (this.selectedStudentToAdd) {
        this.dataService.addTeamMember(teamId, this.selectedStudentToAdd).subscribe({
            next: (success) => {
                if (success) {
                    this.addingToTeamId = null;
                    this.selectedStudentToAdd = null;
                    this.loadData(this.project!.id);
                }
            },
            error: (err) => alert(err.message || 'Error adding member')
        });
    }
  }

  cancelAddMember() {
    this.addingToTeamId = null;
    this.selectedStudentToAdd = null;
  }

  getAvailableForTeam(team: Team): StudentLite[] {
    const memberIds = team.members.map(m => m.student.id);
    return this.availableStudents.filter(s => !memberIds.includes(s.id));
  }

  // ==========================================
  // 3. CRIAÇÃO DE EQUIPA ()
  // ==========================================

  toggleCreateForm() {
    this.showCreateTeamForm = !this.showCreateTeamForm;
    if (!this.showCreateTeamForm) { this.teamForm.reset(); this.members.clear(); }
  }

  addMemberToForm() {
    const studentId = Number(this.selectedStudentId.value);
    if (!studentId) return;
    const student = this.availableStudents.find(s => s.id === studentId);
    if (!student) return;
    const isAlreadyInForm = this.members.controls.some(ctrl => ctrl.value.student.id === student.id);
    if (!isAlreadyInForm) {
      const memberGroup = this.fb.group({ student: [student], role: ['DEVELOPER', Validators.required] });
      this.members.push(memberGroup);
      this.selectedStudentId.reset();
    } else { alert('Student already added.'); }
  }

  removeMemberFromForm(index: number) { this.members.removeAt(index); }

  onSubmitTeam() {
    if (this.teamForm.valid && this.project) {
      const formValue = this.teamForm.value;
      const payload: CreateTeamRequest = {

        name: formValue.name,
        projectId: this.project.id,
        groupNumber: formValue.number,
        members: formValue.members.map((m: any) => ({
          studentId: m.student.id,
          teamRole: m.role
        }))
      };

      this.httpClient.post(`${enviroments.apiUrl}/projects/${this.project.id}/teams`, payload).subscribe((response: any) => {
        console.log("Team criado:", response);

        payload.members.forEach((member) => {
          this.httpClient.post(`${enviroments.apiUrl}/teams/${response.id}/members`, {
            teamRole: member.teamRole,
            projectId: response.projectId,
            studentId: member.studentId

          }).subscribe((response: any) => {
            console.log("TeamMember registado:", response);
          });
        });
        
        alert('Team Created!');
        this.toggleCreateForm();
        this.loadData(this.project!.id);
      });

    } else { this.teamForm.markAllAsTouched(); }
  }

  // ==========================================
  // 4. AWARDS LOGIC
  // ==========================================

  get filteredAwards(): Award[] {
    if (!this.targetType) return [];

    const scopeNeeded = this.targetType === 'STUDENT' ? 'INDIVIDUAL' : 'TEAM'
    
    return this.availableAwards.filter(a => a.scope === scopeNeeded);
  }

  openAwardModalForTeam(team: Team) {
    this.targetType = 'TEAM';
    this.targetId = team.id;
    this.targetName = `Team: ${team.name}`;
    this.selectedAwardId = null;
    this.showAwardModal = true;
  }

  openAwardModalForStudent(student: StudentLite) {
    this.targetType = 'STUDENT';
    this.targetId = student.id;
    this.targetName = `Student: ${student.name}`;
    this.selectedAwardId = null;
    this.showAwardModal = true;
  }

  closeAwardModal() {
    this.showAwardModal = false;
    this.targetType = null;
    this.targetId = null;
    this.selectedAwardId = null;
  }

  confirmAwardAssignment() {
    if (!this.selectedAwardId || !this.targetId || !this.targetType || !this.project?.courseId) return;

    const courseId = this.project.courseId;
    const awardId = Number(this.selectedAwardId);

    if (this.targetType === 'STUDENT') {
        this.dataService.assignAwardToStudent(this.targetId, awardId, courseId).subscribe(success => {
            if (success) {
                alert(`Award assigned to ${this.targetName}!`);
                this.closeAwardModal();
            }
        });
    } else if (this.targetType === 'TEAM') {
        this.dataService.assignAwardToTeam(this.targetId, awardId, courseId).subscribe(success => {
            if (success) {
                alert(`Award assigned to ${this.targetName}!`);
                this.closeAwardModal();
            }
        });
    }
  }

  // --- MODAL SPRINT ---

  openSprintModal(team: Team) {
    this.selectedTeam = team;
    this.showSprintModal = true;
  }

  closeSprintModal() {
    this.showSprintModal = false;
    this.selectedTeam = null;
  }

  getTeamProgress(team: Team): number {
    if (!team.sprints || team.sprints.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;

    team.sprints.forEach(sprint => {
        if (sprint.tasks) {
            totalTasks += sprint.tasks.length;
            completedTasks += sprint.tasks.filter(t => t.status === 'DONE').length;
        }
    });

    return totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  }

  getSprintStatus(sprint: Sprint): string {
    const currentDate = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    
    if (sprint.status) return sprint.status; 

    if (currentDate < startDate) return 'PLANNED';
    if (currentDate >= startDate && currentDate <= endDate) return 'ACTIVE';
    return 'COMPLETED';
  }

  getSprintStatusClass(sprint: Sprint): string {
    const status = sprint.status || this.getSprintStatus(sprint);
    if (status === 'PLANNED') return 'text-bg-secondary';
    if (status === 'ACTIVE') return 'text-bg-primary';
    if (status === 'COMPLETED') return 'text-bg-success';
    return 'text-bg-secondary';
  }
}