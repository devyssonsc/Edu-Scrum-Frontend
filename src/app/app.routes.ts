import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { RegisterDegreeComponent } from './pages/admin-dashboard/register-degree/register-degree.component';

export const routes: Routes = [
    {
        path: 'admin-dashboard',
        component: AdminDashboardComponent
    },
    
    {
        path: 'admin-dashboard/register-degree', 
        component: RegisterDegreeComponent
    }
];
