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
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
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
    }
];
