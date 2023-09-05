import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveListViewComponent } from './leave-list-view/leave-list-view.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';

const routes: Routes = [
  {
    path: 'list',
    component: LeaveListViewComponent
  },
  {
    path: 'request',
    component: LeaveRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLeavesRoutingModule { }
