import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./modules/manage-users/manage-users.module').then(m => m.ManageUsersModule)
  },
  {
    path: 'holidays',
    loadChildren: () => import('./modules/manage-holidays/manage-holidays.module').then(m => m.ManageHolidaysModule)
  },
  {
    path: 'leave-list',
    loadChildren: () => import('./modules/manage-leave-list/manage-leave-list.module').then(m => m.ManageLeaveListModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
