import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RegisterDegreeComponent } from './pages/register-degree/register-degree.component';
import { RegisterCourseComponent } from './pages/register-course/register-course.component';
import { RegisterStudentComponent } from './pages/register-student/register-student.component';
import { RegisterTeacherComponent } from './pages/register-teacher/register-teacher.component';
import { DegreeDetailComponent } from './pages/degree-detail/degree-detail.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import {TeacherDetailComponent} from './pages/teacher-detail/teacher-detail.component';
import {TeacherDashboardComponent} from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCourseDetailComponent } from './pages/teacher-course-detail/teacher-course-detail.component';
import { TeacherCreateProjectComponent } from './pages/teacher-create-project/teacher-create-project.component';
import { LoginComponent } from './pages/login/login.component';
import { TeacherProjectDetailComponent } from './pages/teacher-project-detail/teacher-project-detail.component';
import { TeacherCreateAwardComponent } from './pages/teacher-create-award/teacher-create-award.component';
import { TeacherAwardDetailComponent } from './pages/teacher-award-detail/teacher-award-detail.component';
import { StudentDashboardComponent } from './pages/student-dashboard/student-dashboard.component';
import { RegisterSprintComponent } from './pages/register-sprint/register-sprint.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent
    },
    {
        path: 'admin-dashboard/register-degree',
        component: RegisterDegreeComponent
    },
    {
        path: 'admin-dashboard/register-course',
        component: RegisterCourseComponent
    },
    {
        path: 'admin-dashboard/register-student',
        component: RegisterStudentComponent
    },
    {
        path: 'admin-dashboard/register-teacher',
        component: RegisterTeacherComponent
    },
    {
        path: 'admin-dashboard/degree/:id',
        component: DegreeDetailComponent
    },
    {
        path: 'admin-dashboard/course/:id',
        component: CourseDetailComponent
    },
    {
        path: 'admin-dashboard/student/:id',
        component: StudentDetailComponent
    },
    {
        path:'admin-dashboard/teacher/:id',
        component: TeacherDetailComponent
    },
    {
        path: 'teacher-dashboard',
        component: TeacherDashboardComponent
    },
    {
        path: 'teacher-dashboard/course/:id',
        component: TeacherCourseDetailComponent
    },
    {
        path: 'teacher-dashboard/course/:courseId/create-project',
        component: TeacherCreateProjectComponent
    },
    {
        path: 'teacher-dashboard/project/:id',
        component: TeacherProjectDetailComponent
    },
    {
        path: 'teacher-dashboard/create-award',
        component: TeacherCreateAwardComponent 
    },
    { 
        path: 'teacher-dashboard/award/:id', 
        component: TeacherAwardDetailComponent
    },
    {
        path: 'student-dashboard',
        component: StudentDashboardComponent
    },
    {
        path: 'student-dashboard/register-sprint/:projectId',
        component: RegisterSprintComponent
    }
];
