import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaveFormComponent } from './leave-form/leave-form.component';
import { LeaveListViewComponent } from './leave-list-view/leave-list-view.component';
import { ManageLeavesRoutingModule } from './manage-leaves-routing.module';



@NgModule({
  declarations: [
    LeaveListViewComponent,
    LeaveFormComponent,
  ],
  imports: [
    CommonModule,
    ManageLeavesRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDialogModule,
    MatSortModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ]
})
export class ManageLeavesModule { }
