import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveListViewComponent } from './leave-list-view/leave-list-view.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveListViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageLeavesRoutingModule {}
