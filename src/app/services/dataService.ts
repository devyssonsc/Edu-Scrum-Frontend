import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// ==========================================
// 1. ENUMS 
// ==========================================

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type TeamRole = 'PRODUCT_OWNER' | 'SCRUM_MASTER' | 'DEVELOPER';
export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

// ==========================================
// 2. INTERFACES 
// ==========================================

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Degree {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  name: string;
  degree?: Degree; 
  
  // Campos UI
  code?: string; 
  ects?: number; 
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
  
  // UI Helpers
  courseName?: string;
  teamsCount?: number;
}

export interface Award {
  id: number;
  name: string;
  type: 'Global' | 'Course';
  points: number;
  isOwner: boolean;
}

// ==========================================
// 3. SERVIÇO 
// ==========================================

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // --- DADOS MOCKADOS ---
  
  private degreeEI: Degree = { id: 1, name: 'Computer Engineering' };
  private degreeRI: Degree = { id: 2, name: 'International Relations' };

  private courses: Course[] = [
    { 
      id: 1, code: 'QS', name: 'Software Quality', degree: this.degreeEI, 
      ects: 6, studentsCount: 75, projectsCount: 1 
    },
    { 
      id: 2, code: 'IA', name: 'Artificial Intelligence', degree: this.degreeEI, 
      ects: 6, studentsCount: 75, projectsCount: 2 
    },
    { 
      id: 3, code: 'E', name: 'Entrepreneurship', degree: this.degreeRI, 
      ects: 4, studentsCount: 59, projectsCount: 1 
    }
  ];

  private projects: Project[] = [
    { 
      id: 1, name: 'Final Project 2024', description: 'Scrum Project', 
      startDate: '2024-09-15', endDate: '2024-12-20', 
      course: this.courses[0], courseName: 'Software Quality', teamsCount: 12 
    },
    { 
      id: 2, name: 'Intelligent Agents', description: 'AI Agents', 
      startDate: '2024-10-01', endDate: '2024-11-30', 
      course: this.courses[1], courseName: 'Artificial Intelligence', teamsCount: 8 
    },
    { 
      id: 3, name: 'Testing Mini-Project', description: 'Unit Tests', 
      startDate: '2024-10-01', endDate: '2024-10-30', 
      course: this.courses[0], courseName: 'Software Quality', teamsCount: 12 
    }
  ];

  private awards: Award[] = [
    { id: 1, name: 'Fast Hands', type: 'Global', points: 50, isOwner: false },
    { id: 2, name: 'Best Bug Report', type: 'Course', points: 100, isOwner: true }
  ];

  constructor() { }

  // --- CURSOS ---
  getCourses(): Observable<Course[]> {
    return of(this.courses);
  }

  getCourseByCode(code: string): Observable<Course | undefined> {
    const course = this.courses.find(c => c.code === code);
    return of(course);
  }
  
  getCourseById(id: number): Observable<Course | undefined> {
    const course = this.courses.find(c => c.id === id);
    return of(course);
  }

  // --- PROJETOS ---
  getAllProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProjectsByCourse(courseCode: string): Observable<Project[]> {
    const filtered = this.projects.filter(p => p.course?.code === courseCode);
    return of(filtered);
  }

  createProject(projectData: any): Observable<boolean> {
    const relatedCourse = this.courses.find(c => c.code === projectData.courseCode);

    const newProject: Project = {
      id: this.projects.length + 1,
      name: projectData.name,
      description: projectData.description || '',
      startDate: projectData.startDate,
      endDate: projectData.endDate,
      course: relatedCourse,
      courseName: relatedCourse ? relatedCourse.name : 'Unknown',
      teamsCount: 0
    };

    this.projects.push(newProject);
    
    if (relatedCourse && relatedCourse.projectsCount !== undefined) {
      relatedCourse.projectsCount++;
    }

    return of(true);
  }

  // --- PRÉMIOS ---
  getAwards(): Observable<Award[]> {
    return of(this.awards);
  }

  deleteAward(awardName: string): Observable<boolean> {
    const index = this.awards.findIndex(a => a.name === awardName && a.isOwner);
    if (index !== -1) {
      this.awards.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}