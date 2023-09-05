import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  {
    path: "login",
    loadComponent: () => import('./components/auth/auth.component').then(c => c.AuthComponent)
  },
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('./modules/manage-users/manage-users.module').then(m => m.ManageUsersModule),

      },
      {
        path: 'holidays',
        loadChildren: () => import('./modules/manage-holidays/manage-holidays.module').then(m => m.ManageHolidaysModule),

      },
      {
        path: 'leaves',
        loadChildren: () => import('./modules/manage-leaves/manage-leaves.module').then(m => m.ManageLeavesModule),
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
