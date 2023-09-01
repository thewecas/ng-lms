import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./modules/manage-users/manage-users.module').then(m => m.ManageUsersModule)
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth.component').then(c => c.AuthComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
