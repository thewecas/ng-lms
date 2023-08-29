import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAdminGuard } from './guards/is-admin.guard';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './guards/is-not-authenticated.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then((c) => c.AuthComponent),
    canActivate: [isNotAuthenticatedGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/test-admin.component').then((c) => c.TestAdminComponent),
    canActivate: [isAuthenticatedGuard, isAdminGuard]

  },
  {
    path: 'employee',
    loadComponent: () => import('./components/test-employee.component').then((c) => c.TestEmployeeComponent),
    canActivate: [isAuthenticatedGuard]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
