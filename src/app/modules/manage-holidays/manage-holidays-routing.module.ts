import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidaysViewComponent } from './holidays-view/holidays-view.component';

const routes: Routes = [
  {
    path: '',
    component: HolidaysViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageHolidaysRoutingModule { }
