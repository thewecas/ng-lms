import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import('./components/auth/auth.component').then(c => c.AuthComponent),

  },
  {
    path: '',
    component: NavbarComponent,
    canActivateChild: [isAuthenticatedGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('./modules/manage-users/manage-users.module').then(m => m.ManageUsersModule),
        canActivate: [isAdminGuard]
      },
      {
        path: 'holidays',
        loadChildren: () => import('./modules/manage-holidays/manage-holidays.module').then(m => m.ManageHolidaysModule),
        canActivate: [isAdminGuard]
      },
      {
        path: 'leave-request',
        loadChildren: () => import('./modules/manage-leave-request/manage-leave-request.module').then(m => m.ManageLeaveRequestModule),
        canActivate: [isAdminGuard]
      },
      {
        path: 'leaves',
        loadChildren: () => import('./modules/manage-leaves/manage-leaves.module').then(m => m.ManageLeavesModule),
      },
      {
        path: '',
        redirectTo: 'leaves',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'leaves',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
