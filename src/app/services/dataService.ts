import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// ==========================================
// 1. ENUMS & TYPES
// ==========================================

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type TeamRole = 'PRODUCT_OWNER' | 'SCRUM_MASTER' | 'DEVELOPER';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

// ==========================================
// 2. INTERFACES
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface StudentLite {
  id: number;
  name: string;
  studentNumber: string;
  email: string;
}

export interface Degree {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  degree?: Degree; 
  code: string; 
  studentsCount?: number;
  projectsCount?: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  course?: Course;
  
  // Frontend Helpers
  courseCode?: string; 
  courseName?: string;
  teamsCount?: number;
}

export interface Sprint {
  id: number;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
}

export interface TeamMember {
  id?: number;
  student: StudentLite;
  role: TeamRole;
}

export interface Team {
  id: number;
  name: string;
  projectId: number;
  members: TeamMember[];
  sprints: Sprint[];
}

export interface Award {
  id: number;
  name: string;
  type: 'Global' | 'Course';
  points: number;
  isOwner: boolean;
}

export interface CreateTeamRequest {
  name: string;
  projectId: number;
  members: { studentId: number; teamRole: TeamRole }[];
}

// ==========================================
// 3. SERVICE
// ==========================================

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // --- MOCK DATA ---
  private degreeEI: Degree = { id: 1, name: 'Computer Engineering' };

  private courses: Course[] = [
    { id: 1, code: 'QS', name: 'Software Quality', degree: this.degreeEI, studentsCount: 75, projectsCount: 1 },
    { id: 2, code: 'IA', name: 'Artificial Intelligence', degree: this.degreeEI, studentsCount: 60, projectsCount: 2 }
  ];

  private projects: Project[] = [
    { 
      id: 1, name: 'Final Project 2025', description: 'Development of a Gamified Scrum Platform for University context.', 
      startDate: '2024-09-15', endDate: '2024-12-20', 
      course: this.courses[0], courseCode: 'QS', courseName: 'Software Quality', teamsCount: 2 
    },
    { 
      id: 2, name: 'Intelligent Agents', description: 'Multi-agent system simulation using Python.', 
      startDate: '2024-10-01', endDate: '2024-11-30', 
      course: this.courses[1], courseCode: 'IA', courseName: 'Artificial Intelligence', teamsCount: 0 
    }
  ];

  private mockStudentsQS: StudentLite[] = [
    { id: 50440, name: 'Tiago Silva', studentNumber: '50440', email: '50440@upt.pt' },
    { id: 50441, name: 'David Aroso', studentNumber: '50441', email: '50441@upt.pt' },
    { id: 50442, name: 'Ana Pereira', studentNumber: '50442', email: '50442@upt.pt' },
    { id: 50443, name: 'João Santos', studentNumber: '50443', email: '50443@upt.pt' },
    { id: 50444, name: 'Beatriz Costa', studentNumber: '50444', email: '50444@upt.pt' }
  ];

  private teams: Team[] = [
    {
      id: 101, name: 'Alpha Team', projectId: 1,
      members: [
        { student: this.mockStudentsQS[0], role: 'SCRUM_MASTER' },
        { student: this.mockStudentsQS[1], role: 'PRODUCT_OWNER' }
      ],
      sprints: [
        { id: 1, name: 'Sprint 1', goal: 'Setup Env & Database', startDate: '2024-09-20', endDate: '2024-09-27', status: 'COMPLETED' },
        { id: 2, name: 'Sprint 2', goal: 'Authentication Logic', startDate: '2024-09-28', endDate: '2024-10-05', status: 'ACTIVE' }
      ]
    }
  ];

  constructor() { }

  // --- METHODS ---

  getProjectById(id: number): Observable<Project | undefined> {
    console.log(`🔍 [DataService] Searching for project ID: ${id} (Type: ${typeof id})`);
    
    const p = this.projects.find(proj => proj.id === id);

    if (p) {
        console.log('✅ [DataService] Project Found:', p);
    } else {
        console.warn('❌ [DataService] Project NOT found. Available IDs:', this.projects.map(x => x.id));
    }

    return of(p);
  }

  getCourseByCode(code: string): Observable<Course | undefined> { 
      return of(this.courses.find(c => c.code === code)); 
  }
  
  getCourses(): Observable<Course[]> { return of(this.courses); }
  getAllProjects(): Observable<Project[]> { return of(this.projects); }
  getProjectsByCourse(code: string): Observable<Project[]> { return of(this.projects.filter(p => p.courseCode === code)); }
  getAwards(): Observable<Award[]> { return of([]); }
  deleteAward(n: string): Observable<boolean> { return of(true); }
  deleteProject(n: string): Observable<boolean> { return of(true); }

  getTeamsByProject(projectId: number): Observable<Team[]> {
    return of(this.teams.filter(t => t.projectId === projectId));
  }

  getStudentsByCourse(courseCode: string): Observable<StudentLite[]> {
    if (courseCode === 'QS') return of(this.mockStudentsQS);
    return of([]);
  }

  createProject(projectData: any): Observable<boolean> {
    const relatedCourse = this.courses.find(c => c.code === projectData.courseCode);

    // 1. Calcula o ID corretamente
    const newId = this.projects.length > 0 
        ? Math.max(...this.projects.map(p => p.id)) + 1 
        : 101;

    const newProject: Project = {
      // 2. CORREÇÃO AQUI: Usar a variável newId calculada acima
      id: newId, 
      
      name: projectData.name,
      description: projectData.description || 'No description saved',
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      course: relatedCourse,
      courseCode: projectData.courseCode,
      courseName: relatedCourse ? relatedCourse.name : 'Unknown',
      teamsCount: 0
    };

    this.projects.push(newProject);

    console.log('✅ [DataService] Project Created:', newProject);
    console.log('📊 [DataService] All Projects:', this.projects);

    return of(true);
  }

  createTeam(request: CreateTeamRequest): Observable<boolean> {
    const hasConflict = request.members.some(m => m.studentId === 50442);

    if (hasConflict) {
      return throwError(() => ({ status: 409, message: 'Student 50442 is already in a team.' }));
    }

    const newMembers: TeamMember[] = request.members.map(m => {
      const student = this.mockStudentsQS.find(s => s.id === m.studentId) || this.mockStudentsQS[0];
      return { student, role: m.teamRole };
    });

    const newTeam: Team = {
      id: Math.floor(Math.random() * 10000),
      name: request.name,
      projectId: request.projectId,
      members: newMembers,
      sprints: []
    };

    this.teams.push(newTeam);
    return of(true).pipe(delay(500)); 
  }
}