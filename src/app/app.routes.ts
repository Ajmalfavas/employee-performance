import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard)
    }
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
    // },
    // {
    //     path: 'reports',
    //     loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent)
    // },
    // {
    //     path: 'settings',
    //     loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent)
    // }
];
