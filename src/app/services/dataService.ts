import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

// ==========================================
// 1. ENUMS & TYPES
// ==========================================

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type TeamRole = 'PRODUCT_OWNER' | 'SCRUM_MASTER' | 'DEVELOPER';
export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';
export type AwardType = 'GLOBAL' | 'COURSE';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

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
  degreeId?: number;
  courseIds: number[]; 
}

export interface Degree {
  id: number;
  name: string;
  coursesCount?: number;
  teachersCount?: number;
  studentsCount?: number;
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  coursesCount: number;
  courseIds: number[];
}

export interface Course {
  id: number;
  name: string;
  degree?: Degree;
  degreeName?: string;
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
  courseId?: number;
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
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assigneeId?: number; 
  assigneeName?: string;
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
  description: string;
  points: number;
  type: AwardType;
  icon?: string;
  courseId?: number;
  courseName?: string; 
  isOwner?: boolean;
}

export interface StudentAward {
  id: number;
  studentId: number;
  awardId: number;
  date: string;
  courseId?: number;
}

export interface TeamAward {
  id: number;
  teamId: number;
  awardId: number;
  date: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  entityType: 'STUDENT' | 'TEAM';
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
  providedIn: 'root',
})
export class DataService {
  // --- MOCK DATA ---
  private degrees: Degree[] = [
    { id: 1, name: 'Computer Engineering', coursesCount: 30, teachersCount: 15, studentsCount: 217 },
    { id: 2, name: 'Information Systems', coursesCount: 25, teachersCount: 10, studentsCount: 150 },
  ];

  private courses: Course[] = [
    { id: 1, name: 'Software Quality', degree: this.degrees[0], degreeName: 'Computer Engineering', studentsCount: 75, projectsCount: 1 },
    { id: 2, name: 'Artificial Intelligence', degree: this.degrees[0], degreeName: 'Computer Engineering', studentsCount: 60, projectsCount: 2 },
    { id: 3, name: 'Project Management', degree: this.degrees[1], degreeName: 'Information Systems', studentsCount: 45, projectsCount: 1 },
  ];

  private students: StudentLite[] = [
    { id: 1, name: 'Tiago Silva', studentNumber: '50440', email: '50440@upt.pt', degreeId: 1, courseIds: [1] },
    { id: 2, name: 'David Aroso', studentNumber: '50441', email: '50441@upt.pt', degreeId: 1, courseIds: [1] },
    { id: 3, name: 'Ana Pereira', studentNumber: '50442', email: '50442@upt.pt', degreeId: 1, courseIds: [1] },
    { id: 4, name: 'João Santos', studentNumber: '50443', email: '50443@upt.pt', degreeId: 1, courseIds: [] },
    { id: 5, name: 'Beatriz Costa', studentNumber: '50444', email: '50444@upt.pt', degreeId: 2, courseIds: [] },
  ];

  private teachers: Teacher[] = [
    { id: 1, name: 'Fátima Leal', email: 'fatimal@upt.pt', coursesCount: 3, courseIds: [1, 3] },
    { id: 2, name: 'Bruno Cunha', email: 'bruninho@upt.pt', coursesCount: 4, courseIds: [1, 2] },
    { id: 3, name: 'Joaquim Silva', email: 'joaquim@upt.pt', coursesCount: 2, courseIds: [2] },
  ];

  private projects: Project[] = [
    {
      id: 1,
      name: 'Final Project 2025',
      description: 'Gamified Scrum Platform.',
      startDate: '2024-09-15',
      endDate: '2024-12-20',
      course: this.courses[0],
      courseId: 1,
      courseName: 'Software Quality',
      teamsCount: 2,
    },
  ];

  // --- MOCK TEAMS ---
  private teams: Team[] = [
    {
      id: 101,
      name: 'Alpha Team',
      projectId: 1,
      members: [
        { student: this.students[0], role: 'PRODUCT_OWNER' }, 
        { student: this.students[1], role: 'SCRUM_MASTER' }, 
        { student: this.students[2], role: 'DEVELOPER' }     
      ],
      sprints: [
        {
            id: 1,
            name: 'Sprint 1',
            goal: 'Setup Project Architecture',
            startDate: '2024-10-01',
            endDate: '2024-10-15',
            status: 'COMPLETED',
            tasks: [
                { id: 1, title: 'Database Schema', status: 'DONE', assigneeId: 1, assigneeName: 'Tiago Silva' },
                { id: 2, title: 'Auth API', status: 'DONE', assigneeId: 2, assigneeName: 'David Aroso' }
            ]
        },
        {
            id: 2,
            name: 'Sprint 2',
            goal: 'Frontend Basics',
            startDate: '2024-10-16',
            endDate: '2024-10-30',
            status: 'ACTIVE',
            tasks: [
                { id: 3, title: 'Login Page', status: 'DONE', assigneeId: 3, assigneeName: 'Ana Pereira' },
                { id: 4, title: 'Dashboard Layout', status: 'IN_PROGRESS', assigneeId: 2, assigneeName: 'David Aroso' },
                { id: 5, title: 'User Profile', status: 'TODO', assigneeId: 1, assigneeName: 'Tiago Silva' }
            ]
        }
      ]
    },
  ];

  // --- MOCK AWARDS ---
  private awards: Award[] = [
    { id: 1, name: 'Fast Hands', description: 'Completed task in record time', points: 5, type: 'GLOBAL', icon: 'bi-lightning-charge-fill', isOwner: false },
    { id: 2, name: 'Multitasker', description: 'Completed 5 tasks in a sprint', points: 4, type: 'GLOBAL', icon: 'bi-layers-fill', isOwner: false },
    { id: 3, name: 'Best Pitch', description: 'Best project presentation', points: 1, type: 'COURSE', courseId: 1, courseName: 'Software Quality', icon: 'bi-mic-fill', isOwner: true }, 
  ];

  // --- TABELAS DE LIGAÇÃO (MOCK) ---
  private studentAwards: StudentAward[] = [
    { id: 1, studentId: 1, awardId: 3, courseId: 1, date: '2024-12-01' }
  ];
  
  private teamAwards: TeamAward[] = [
    { id: 2, teamId: 101, awardId: 3, date: '2024-12-02' }
  ];

  constructor() {}

  // --- GETTERS ---

  getDegrees(): Observable<Degree[]> { return of(this.degrees); }
  getDegreeById(id: number): Observable<Degree | undefined> { return of(this.degrees.find((d) => d.id === id)); }
  getCourses(): Observable<Course[]> { return of(this.courses); }
  getCourseById(id: number): Observable<Course | undefined> { return of(this.courses.find((c) => c.id === id)); }
  getCoursesByDegreeId(degreeId: number): Observable<Course[]> { return of(this.courses.filter((c) => c.degree?.id === degreeId)); }


  getStudents(): Observable<StudentLite[]> { return of(this.students); }
  getStudentById(id: number): Observable<StudentLite | undefined> { return of(this.students.find((s) => s.id === id)); }
  
  getStudentsByCourseId(courseId: number): Observable<StudentLite[]> {
    return of(this.students.filter(s => s.courseIds && s.courseIds.includes(courseId)));
  }

  getTeachers(): Observable<Teacher[]> { return of(this.teachers); }
  getTeacherById(id: number): Observable<Teacher | undefined> { return of(this.teachers.find((t) => t.id === id)); }
  getTeachersByCourseId(courseId: number): Observable<Teacher[]> { return of(this.teachers.filter((t) => t.courseIds.includes(courseId))); }
  getProjectById(id: number): Observable<Project | undefined> { return of(this.projects.find((p) => p.id === id)); }


  getTeamsByProject(projectId: number): Observable<Team[]> { return of(this.teams.filter((t) => t.projectId === projectId)); }
  getTeamsByCourseId(courseId: number): Observable<Team[]> {
    const projectIds = this.projects.filter((p) => p.courseId === courseId).map((p) => p.id);
    return of(this.teams.filter((t) => projectIds.includes(t.projectId)));
  }
  
  getAwards(): Observable<Award[]> { return of(this.awards); }
  
  // --- GAMIFICATION METHODS --- 
  getAwardsByCourse(courseId: number): Observable<Award[]> {
    const courseAwards = this.awards.filter((a) => a.type === 'GLOBAL' || a.courseId === courseId);
    return of(courseAwards);
  }

  getGlobalAwards(): Observable<Award[]> {
    return of(this.awards.filter((a) => a.type === 'GLOBAL'));
  }

  getAwardById(id: number): Observable<Award | undefined> {
    return of(this.awards.find((a) => a.id === id));
  }

  getAssignmentsByAward(awardId: number): Observable<any[]> {
    const result: any[] = [];
    this.studentAwards
        .filter(sa => sa.awardId === awardId)
        .forEach(sa => {
            const student = this.students.find(s => s.id === sa.studentId);
            result.push({
                id: sa.id, 
                recipientId: sa.studentId,
                recipientName: student ? student.name : 'Unknown Student',
                type: 'STUDENT',
                date: sa.date
            });
        });

    this.teamAwards
        .filter(ta => ta.awardId === awardId)
        .forEach(ta => {
            const team = this.teams.find(t => t.id === ta.teamId);
            result.push({
                id: ta.id, 
                recipientId: ta.teamId,
                recipientName: team ? team.name : 'Unknown Team',
                type: 'TEAM',
                date: ta.date
            });
        });

    return of(result);
  }

  getAllProjects(): Observable<Project[]> {
    const projectsWithDynamicCount = this.projects.map(p => {
      const realTeamCount = this.teams.filter(t => t.projectId === p.id).length;
      return { ...p, teamsCount: realTeamCount };
    });
    return of(projectsWithDynamicCount);
  }
  
  getProjectsByCourseId(courseId: number): Observable<Project[]> {
    const filteredProjects = this.projects.filter((p) => p.courseId === courseId);
    const projectsWithDynamicCount = filteredProjects.map(p => {
      const realTeamCount = this.teams.filter(t => t.projectId === p.id).length;
      return { ...p, teamsCount: realTeamCount };
    });
    return of(projectsWithDynamicCount);
  }

  createAward(awardData: { name: string; description: string; points: number; courseId: number; }): Observable<boolean> {
    const newId = this.awards.length > 0 ? Math.max(...this.awards.map((a) => a.id)) + 1 : 1;
    const course = this.courses.find(c => c.id === awardData.courseId);
    const courseName = course ? course.name : 'Unknown';

    const newAward: Award = {
      id: newId,
      name: awardData.name,
      description: awardData.description,
      points: awardData.points,
      type: 'COURSE',
      courseId: awardData.courseId,
      courseName: courseName, 
      icon: undefined,
      isOwner: true,
    };
    this.awards.push(newAward);
    return of(true);
  }

  // --- CREATE / ASSIGN METHODS ---

  assignAwardToStudent(studentId: number, awardId: number, courseId: number): Observable<boolean> {
    const newId = this.studentAwards.length > 0 ? Math.max(...this.studentAwards.map((sa) => sa.id)) + 1 : 1;
    this.studentAwards.push({
      id: newId,
      studentId: studentId,
      awardId: awardId,
      courseId: courseId,
      date: new Date().toISOString(),
    });
    return of(true);
  }

  assignAwardToTeam(teamId: number, awardId: number, courseId: number): Observable<boolean> {
    const team = this.teams.find((t) => t.id === teamId);
    if (!team) return of(false); 

    const newTeamAwardId = this.teamAwards.length > 0 ? Math.max(...this.teamAwards.map((ta) => ta.id)) + 1 : 1;
    this.teamAwards.push({
      id: newTeamAwardId,
      teamId: teamId,
      awardId: awardId,
      date: new Date().toISOString(),
    });

    return of(true);
  }

  // --- DELETE METHODS (REVOKE) ---
  
  revokeAssignment(assignmentId: number): Observable<boolean> {
    const sIndex = this.studentAwards.findIndex(sa => sa.id === assignmentId);
    if (sIndex !== -1) {
      this.studentAwards.splice(sIndex, 1);
      return of(true);
    }
    const tIndex = this.teamAwards.findIndex(ta => ta.id === assignmentId);
    if (tIndex !== -1) {
      this.teamAwards.splice(tIndex, 1);
      return of(true);
    }
    return of(true);
  }

  // --- RANKINGS --- 
  getStudentRankings(): Observable<LeaderboardEntry[]> {
    const rankings: LeaderboardEntry[] = [];

    this.students.forEach((student) => {
      const studentAssignments = this.studentAwards.filter((sa) => sa.studentId === student.id);
      let totalPoints = 0;
      studentAssignments.forEach((sa) => {
        const award = this.awards.find((a) => a.id === sa.awardId);
        if (award) totalPoints += award.points;
      });

      if (totalPoints > 0) {
        rankings.push({
          rank: 0,
          name: student.name,
          points: totalPoints,
          entityType: 'STUDENT',
        });
      }
    });

    rankings.sort((a, b) => b.points - a.points);
    rankings.forEach((entry, index) => (entry.rank = index + 1));

    return of(rankings);
  }

  getTeamRankings(courseId: number): Observable<LeaderboardEntry[]> {
    const rankings: LeaderboardEntry[] = []; 
    const projectIds = this.projects.filter((p) => p.courseId === courseId).map((p) => p.id);
    const courseTeams = this.teams.filter((t) => projectIds.includes(t.projectId));

    courseTeams.forEach((team) => {
      const teamAssignments = this.teamAwards.filter((ta) => ta.teamId === team.id);
      let totalPoints = 0;

      teamAssignments.forEach((ta) => {
        const award = this.awards.find((a) => a.id === ta.awardId);
        if (award) totalPoints += award.points;
      });

      if (totalPoints > 0) {
        rankings.push({
          rank: 0,
          name: team.name,
          points: totalPoints,
          entityType: 'TEAM',
        });
      }
    });

    rankings.sort((a, b) => b.points - a.points);
    rankings.forEach((entry, index) => (entry.rank = index + 1));

    return of(rankings);
  }

  // --- UPDATE METHODS ---

  updateDegree(id: number, updatedData: { name: string }): Observable<boolean> {
    const degree = this.degrees.find((d) => d.id === id);
    if (degree) {
      degree.name = updatedData.name;
      this.courses.forEach((course) => {
        if (course.degree && course.degree.id === id) {
          course.degree.name = updatedData.name;
          course.degreeName = updatedData.name;
        }
      });
      return of(true);
    }
    return of(false);
  }

  updateCourse(id: number, updatedData: { name: string; degreeId: number }): Observable<boolean> {
    const course = this.courses.find((c) => c.id === id);
    const degree = this.degrees.find((d) => d.id === updatedData.degreeId);

    if (course && degree) {
      course.name = updatedData.name;
      course.degree = degree;
      course.degreeName = degree.name;
      return of(true);
    }
    return of(false);
  }

  updateStudent(id: number, updatedData: { name: string; email: string; degreeId: number }): Observable<boolean> {
    const student = this.students.find((s) => s.id === id);
    if (student) {
      const emailExists = this.students.some((s) => s.email === updatedData.email && s.id !== id);
      if (emailExists) return throwError(() => ({ status: 409, message: 'Email already exists.', }));

      student.name = updatedData.name;
      student.email = updatedData.email;
      student.degreeId = updatedData.degreeId;
      return of(true);
    }
    return of(false);
  }

  updateTeacher(id: number, updatedData: { name: string; email: string }): Observable<boolean> {
    const teacher = this.teachers.find((t) => t.id === id);
    if (teacher) {
      const emailExists = this.teachers.some((t) => t.email === updatedData.email && t.id !== id);
      if (emailExists) return throwError(() => ({ status: 409, message: 'Email already exists.', }));

      teacher.name = updatedData.name;
      teacher.email = updatedData.email;
      return of(true);
    }
    return of(false);
  }

  updateAward(id: number, data: { name: string; description: string; points: number; courseId?: number | string | null }): Observable<boolean> {
    const award = this.awards.find((a) => a.id === id);
    if (award && award.type === 'COURSE') {
      award.name = data.name;
      award.description = data.description;
      award.points = data.points;
      
      if (data.courseId) {
          const newCourseId = Number(data.courseId);
          const newCourse = this.courses.find(c => c.id === newCourseId);
          
          if (newCourse) {
              award.courseId = newCourseId;
              award.courseName = newCourse.name; 
          }
      }
      return of(true);
    }
    return of(false);
  }

  // --- MÉTODOS PARA GESTÃO DE PROJETOS E EQUIPAS ---

  updateProject(id: number, data: { name: string; description: string; startDate: string; endDate: string }): Observable<boolean> {
    const project = this.projects.find((p) => p.id === id);
    if (project) {
      project.name = data.name;
      project.description = data.description;
      project.startDate = data.startDate;
      project.endDate = data.endDate;
      return of(true);
    }
    return of(false);
  }

  deleteTeam(teamId: number): Observable<boolean> {
    const index = this.teams.findIndex((t) => t.id === teamId);
    if (index !== -1) {
      this.teams.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
  removeTeamMember(teamId: number, studentId: number): Observable<boolean> {
    const team = this.teams.find((t) => t.id === teamId);
    if (team) {
      const memberIndex = team.members.findIndex((m) => m.student.id === studentId);
      if (memberIndex !== -1) {
        team.members.splice(memberIndex, 1);
        return of(true);
      }
    }
    return of(false);
  }
  addTeamMember(teamId: number, studentId: number): Observable<boolean> {
    const team = this.teams.find((t) => t.id === teamId);
    const student = this.students.find((s) => s.id === studentId);

    if (team && student) {
      const exists = team.members.some((m) => m.student.id === studentId);
      if (exists) {
          return throwError(() => ({ status: 409, message: 'Student already in team' }));
      }

      team.members.push({
        student: student,
        role: 'DEVELOPER'
      });
      return of(true);
    }
    return of(false);
  }

  // --- RELATIONSHIP METHODS ---

  addTeacherToCourse(courseId: number, teacherId: number): Observable<boolean> {
    const teacher = this.teachers.find((t) => t.id === teacherId);
    if (teacher) {
      if (!teacher.courseIds.includes(courseId)) {
        teacher.courseIds.push(courseId);
        teacher.coursesCount = teacher.courseIds.length;
      }
      return of(true);
    }
    return of(false);
  }

  removeTeacherFromCourse(courseId: number, teacherId: number): Observable<boolean> {
    const teacher = this.teachers.find((t) => t.id === teacherId);
    if (teacher) {
      const index = teacher.courseIds.indexOf(courseId);
      if (index > -1) {
        teacher.courseIds.splice(index, 1);
        teacher.coursesCount = teacher.courseIds.length;
        return of(true);
      }
    }
    return of(false);
  }

  // NOVOS MÉTODOS PARA ALUNOS
  addStudentToCourse(courseId: number, studentId: number): Observable<boolean> {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      if (!student.courseIds) student.courseIds = [];
      if (!student.courseIds.includes(courseId)) {
        student.courseIds.push(courseId);
        
        // Atualizar contador no curso (opcional mas recomendado)
        const course = this.courses.find(c => c.id === courseId);
        if(course) course.studentsCount = (course.studentsCount || 0) + 1;

        return of(true);
      }
    }
    return of(false);
  }

  removeStudentFromCourse(courseId: number, studentId: number): Observable<boolean> {
    const student = this.students.find(s => s.id === studentId);
    if (student && student.courseIds) {
      const index = student.courseIds.indexOf(courseId);
      if (index > -1) {
        student.courseIds.splice(index, 1);
        
        // Atualizar contador no curso
        const course = this.courses.find(c => c.id === courseId);
        if(course && (course.studentsCount || 0) > 0) course.studentsCount!--;

        return of(true);
      }
    }
    return of(false);
  }

  // --- DELETE METHODS ---

  deleteDegree(id: number): Observable<boolean> {
    const index = this.degrees.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.degrees.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteCourse(id: number): Observable<boolean> {
    const index = this.courses.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteStudent(id: number): Observable<boolean> {
    const index = this.students.findIndex((s) => s.id === id);
    if (index !== -1) {
      const student = this.students[index];
      if (student.degreeId) {
        const degree = this.degrees.find((d) => d.id === student.degreeId);
        if (degree && degree.studentsCount && degree.studentsCount > 0) {
          degree.studentsCount--;
        }
        this.courses.forEach((c) => {
          if (c.degree && c.degree.id === student.degreeId) {
            if (c.studentsCount && c.studentsCount > 0) {
              c.studentsCount--;
            }
          }
        });
      }
      this.teams.forEach((team) => {
        const memberIndex = team.members.findIndex((m) => m.student.id === id);
        if (memberIndex !== -1) {
          team.members.splice(memberIndex, 1);
        }
      });
      this.students.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteTeacher(id: number): Observable<boolean> {
    const index = this.teachers.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.teachers.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteProject(name: string): Observable<boolean> {
    const index = this.projects.findIndex((p) => p.name === name);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteAward(name: string): Observable<boolean> {
    const index = this.awards.findIndex((a) => a.name === name);
    if (index !== -1 && this.awards[index].type === 'COURSE') {
      this.awards.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
  

  // --- CREATE METHODS ---

  createProject(projectData: any): Observable<boolean> {
    const courseId = Number(projectData.courseId);
    const relatedCourse = this.courses.find((c) => c.id === courseId);
    const newId = this.projects.length > 0 ? Math.max(...this.projects.map((p) => p.id)) + 1 : 101;

    const newProject: Project = {
      id: newId,
      name: projectData.name,
      description: projectData.description || 'No description saved',
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      course: relatedCourse,
      courseId: courseId,
      courseName: relatedCourse ? relatedCourse.name : 'Unknown',
      teamsCount: 0,
    };
    this.projects.push(newProject);
    return of(true);
  }

  createTeam(request: CreateTeamRequest): Observable<boolean> {
    const hasConflict = request.members.some((m) => m.studentId === 50442); 
    if (hasConflict) return throwError(() => ({ status: 409, message: 'Conflict' }));

    const smCount = request.members.filter(m => m.teamRole === 'SCRUM_MASTER').length;
    const poCount = request.members.filter(m => m.teamRole === 'PRODUCT_OWNER').length;
    const devCount = request.members.filter(m => m.teamRole === 'DEVELOPER').length;

    if (smCount !== 1 || poCount !== 1 || devCount < 1) {
        return throwError(() => ({ 
            status: 400, 
            message: 'Invalid Team Composition. Required: 1 SM, 1 PO, 1+ Devs.' 
        }));
    }

    const newMembers: TeamMember[] = request.members.map((m) => {
      const student = this.students.find((s) => s.id === m.studentId) || this.students[0];
      return { student, role: m.teamRole };
    });

    const newTeam: Team = {
      id: Math.floor(Math.random() * 10000),
      name: request.name,
      projectId: request.projectId,
      members: newMembers,
      sprints: [],
    };
    this.teams.push(newTeam);
    return of(true).pipe(delay(500));
  }
}



