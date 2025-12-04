import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RegisterDegreeComponent } from './pages/admin-dashboard/register-degree/register-degree.component';
import { RegisterCourseComponent } from './pages/admin-dashboard/register-course/register-course.component';
import { RegisterStudentComponent } from './pages/admin-dashboard/register-student/register-student.component';
import { RegisterTeacherComponent } from './pages/admin-dashboard/register-teacher/register-teacher.component';
import {DegreeDetailComponent} from './pages/admin-dashboard/degree-detail/degree-detail.component';
import { CourseDetailComponent } from './pages/admin-dashboard/course-detail/course-detail.component';
import { StudentDetailComponent } from './pages/admin-dashboard/student-detail/student-detail.component';
import {TeacherDetailComponent} from './pages/admin-dashboard/teacher-detail/teacher-detail.component';

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
