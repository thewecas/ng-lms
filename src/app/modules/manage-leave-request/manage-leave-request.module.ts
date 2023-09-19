import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { ManageLeaveRequestRoutingModule } from './manage-leave-request-routing.module';

@NgModule({
  declarations: [LeaveRequestComponent],
  imports: [
    CommonModule,
    ManageLeaveRequestRoutingModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    SortArrayPipe,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [SortArrayPipe],
})
export class ManageLeaveRequestModule {}
