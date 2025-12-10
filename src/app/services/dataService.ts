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
  degreeId?: number; 
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
  
  private degrees: Degree[] = [
    { id: 1, name: 'Computer Engineering', coursesCount: 30, teachersCount: 15, studentsCount: 217 },
    { id: 2, name: 'Information Systems', coursesCount: 25, teachersCount: 10, studentsCount: 150 }
  ];

  private courses: Course[] = [
    { id: 1, name: 'Software Quality', degree: this.degrees[0], degreeName: 'Computer Engineering', studentsCount: 75, projectsCount: 1 },
    { id: 2, name: 'Artificial Intelligence', degree: this.degrees[0], degreeName: 'Computer Engineering', studentsCount: 60, projectsCount: 2 },
    { id: 3, name: 'Project Management', degree: this.degrees[1], degreeName: 'Information Systems', studentsCount: 45, projectsCount: 1 }
  ];

  private students: StudentLite[] = [
    { id: 1, name: 'Tiago Silva', studentNumber: '50440', email: '50440@upt.pt', degreeId: 1 },
    { id: 2, name: 'David Aroso', studentNumber: '50441', email: '50441@upt.pt', degreeId: 1 },
    { id: 3, name: 'Ana Pereira', studentNumber: '50442', email: '50442@upt.pt', degreeId: 1 },
    { id: 4, name: 'João Santos', studentNumber: '50443', email: '50443@upt.pt', degreeId: 1 },
    { id: 5, name: 'Beatriz Costa', studentNumber: '50444', email: '50444@upt.pt', degreeId: 2 }
  ];

  private teachers: Teacher[] = [
    { id: 1, name: 'Fátima Leal', email: 'fatimal@upt.pt', coursesCount: 3, courseIds: [1, 3] },
    { id: 2, name: 'Bruno Cunha', email: 'bruninho@upt.pt', coursesCount: 4, courseIds: [1, 2] },
    { id: 3, name: 'Joaquim Silva', email: 'joaquim@upt.pt', coursesCount: 2, courseIds: [2] }
  ];

  private projects: Project[] = [
    { 
      id: 1, name: 'Final Project 2025', description: 'Gamified Scrum Platform.', 
      startDate: '2024-09-15', endDate: '2024-12-20', 
      course: this.courses[0], courseId: 1, courseName: 'Software Quality', teamsCount: 2 
    }
  ];

  private teams: Team[] = []; 

  constructor() { }

  // --- GETTERS ---

  getDegrees(): Observable<Degree[]> { return of(this.degrees); }
  getDegreeById(id: number): Observable<Degree | undefined> { 
    return of(this.degrees.find(d => d.id === id)); 
  }
  
  getCourses(): Observable<Course[]> { return of(this.courses); }
  getCourseById(id: number): Observable<Course | undefined> { 
      return of(this.courses.find(c => c.id === id)); 
  }
  
  getCoursesByDegreeId(degreeId: number): Observable<Course[]> {
    return of(this.courses.filter(c => c.degree?.id === degreeId));
  }

  getStudents(): Observable<StudentLite[]> { return of(this.students); }
  
  getStudentById(id: number): Observable<StudentLite | undefined> {
    return of(this.students.find(s => s.id === id));
  }
  
  getTeachers(): Observable<Teacher[]> { return of(this.teachers); }
  
  getTeacherById(id: number): Observable<Teacher | undefined> {
    return of(this.teachers.find(t => t.id === id));
  }

  getTeachersByCourseId(courseId: number): Observable<Teacher[]> {
    return of(this.teachers.filter(t => t.courseIds.includes(courseId)));
  }

  getAllProjects(): Observable<Project[]> { return of(this.projects); }
  getProjectById(id: number): Observable<Project | undefined> {
    return of(this.projects.find(p => p.id === id));
  }
  getProjectsByCourseId(courseId: number): Observable<Project[]> { 
    return of(this.projects.filter(p => p.courseId === courseId)); 
  }

  getTeamsByProject(projectId: number): Observable<Team[]> {
    return of(this.teams.filter(t => t.projectId === projectId));
  }

  getStudentsByCourseId(courseId: number): Observable<StudentLite[]> {
    return of(this.students);
  }

  getAwards(): Observable<Award[]> { return of([]); }

  // --- UPDATE METHODS ---

  updateDegree(id: number, updatedData: { name: string }): Observable<boolean> {
    const degree = this.degrees.find(d => d.id === id);
    if (degree) {
      degree.name = updatedData.name;
      this.courses.forEach(course => {
        if (course.degree && course.degree.id === id) {
          course.degree.name = updatedData.name; 
          course.degreeName = updatedData.name;  
        }
      });
      return of(true);
    }
    return of(false);
  }

  updateCourse(id: number, updatedData: { name: string, degreeId: number }): Observable<boolean> {
    const course = this.courses.find(c => c.id === id);
    const degree = this.degrees.find(d => d.id === updatedData.degreeId);

    if (course && degree) {
      course.name = updatedData.name;
      course.degree = degree;         
      course.degreeName = degree.name; 
      return of(true);
    }
    return of(false);
  }

  updateStudent(id: number, updatedData: { name: string, email: string, degreeId: number }): Observable<boolean> {
    const student = this.students.find(s => s.id === id);
    
    if (student) {
        const emailExists = this.students.some(s => s.email === updatedData.email && s.id !== id);
        if (emailExists) return throwError(() => ({ status: 409, message: 'Email already exists.' }));

        student.name = updatedData.name;
        student.email = updatedData.email;
        student.degreeId = updatedData.degreeId;
        return of(true);
    }
    return of(false);
  }

  // NOVO: Atualizar Professor com validação de email
  updateTeacher(id: number, updatedData: { name: string, email: string }): Observable<boolean> {
    const teacher = this.teachers.find(t => t.id === id);
    
    if (teacher) {
        // Validação: Verificar se o email já existe noutro professor
        const emailExists = this.teachers.some(t => t.email === updatedData.email && t.id !== id);
        
        if (emailExists) {
            return throwError(() => ({ status: 409, message: 'Email already exists.' }));
        }

        // Atualiza os dados
        teacher.name = updatedData.name;
        teacher.email = updatedData.email;
        return of(true);
    }
    return of(false);
  }

  // --- RELATIONSHIP METHODS ---

  addTeacherToCourse(courseId: number, teacherId: number): Observable<boolean> {
    const teacher = this.teachers.find(t => t.id === teacherId);
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
    const teacher = this.teachers.find(t => t.id === teacherId);
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

  // --- DELETE METHODS ---

  deleteDegree(id: number): Observable<boolean> {
    const index = this.degrees.findIndex(d => d.id === id);
    if (index !== -1) {
      this.degrees.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteCourse(id: number): Observable<boolean> {
    const index = this.courses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteStudent(id: number): Observable<boolean> {
    const index = this.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.students.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteTeacher(id: number): Observable<boolean> {
    const index = this.teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      this.teachers.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  deleteProject(name: string): Observable<boolean> {
    const index = this.projects.findIndex(p => p.name === name);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
  
  deleteAward(name: string): Observable<boolean> { return of(true); }

  // --- CREATE METHODS ---

  createProject(projectData: any): Observable<boolean> {
    const courseId = Number(projectData.courseId);
    const relatedCourse = this.courses.find(c => c.id === courseId);
    const newId = this.projects.length > 0 ? Math.max(...this.projects.map(p => p.id)) + 1 : 101;

    const newProject: Project = {
      id: newId, 
      name: projectData.name,
      description: projectData.description || 'No description saved',
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      course: relatedCourse,
      courseId: courseId, 
      courseName: relatedCourse ? relatedCourse.name : 'Unknown',
      teamsCount: 0
    };
    this.projects.push(newProject);
    return of(true);
  }

  createTeam(request: CreateTeamRequest): Observable<boolean> {
    const hasConflict = request.members.some(m => m.studentId === 50442);
    if (hasConflict) return throwError(() => ({ status: 409, message: 'Conflict' }));

    const newMembers: TeamMember[] = request.members.map(m => {
      const student = this.students.find(s => s.id === m.studentId) || this.students[0];
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