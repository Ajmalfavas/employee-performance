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
    },
    {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.route').then((m) => m.routes)
    },
    {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings)
    }
];
