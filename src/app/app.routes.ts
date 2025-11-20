import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RegisterDegreeComponent } from './pages/admin-dashboard/register-degree/register-degree.component';
import { RegisterCourseComponent } from './pages/admin-dashboard/register-course/register-course.component';
import { RegisterStudentComponent } from './pages/admin-dashboard/register-student/register-student.component';
import { RegisterTeacherComponent } from './pages/admin-dashboard/register-teacher/register-teacher.component';

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
    }
];
