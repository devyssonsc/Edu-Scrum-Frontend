import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { DataService, Project, Team, StudentLite, CreateTeamRequest, Sprint } from '../../services/dataService';

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

  // Modal State
  showSprintModal = false;
  selectedTeam: Team | null = null;

  constructor() {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      members: this.fb.array([], [Validators.minLength(3)]) 
    }, { validators: this.teamRolesValidator });
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
      if (p && p.courseId) this.loadStudents(p.courseId);
    });
    this.dataService.getTeamsByProject(projectId).subscribe(t => { this.teams = t; });
  }

  loadStudents(courseId: number) {
    this.dataService.getStudentsByCourseId(courseId).subscribe(s => this.availableStudents = s);
  }

  get members() { return this.teamForm.get('members') as FormArray; }

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
        name: formValue.name, projectId: this.project.id,
        members: formValue.members.map((m: any) => ({ studentId: m.student.id, teamRole: m.role }))
      };
      this.dataService.createTeam(payload).subscribe({
        next: (success) => {
          if (success) {
            alert(`Team created successfully!`);
            this.toggleCreateForm();
            this.loadData(this.project!.id); 
          }
        },
        error: (err) => {
            if(err.status === 400) alert(err.message);
            else if (err.status === 409) alert('Student conflict.');
            else alert('Error creating team.');
        }
      });
    } else { this.teamForm.markAllAsTouched(); }
  }

  // --- MODAL LOGIC & HELPERS ---

  openSprintModal(team: Team) {
    this.selectedTeam = team;
    this.showSprintModal = true;
  }

  closeSprintModal() {
    this.showSprintModal = false;
    this.selectedTeam = null;
  }

  // Calcula progresso total da equipa 
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

  // Lógica de Status do Sprint 
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