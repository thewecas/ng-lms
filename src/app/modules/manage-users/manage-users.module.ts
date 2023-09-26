import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { ManageUsersRoutingModule } from './manage-users-routing.module';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersViewComponent } from './users-view/users-view.component';

@NgModule({
  declarations: [UsersViewComponent, UserFormComponent],
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
    SortArrayPipe,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatDialogModule,
    ManageUsersRoutingModule,
  ],

  providers: [SortArrayPipe],
})
export class ManageUsersModule {}
