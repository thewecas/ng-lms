import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { User } from 'src/app/models/user';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersViewComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'employeeId',
    'name',
    'email',
    'designation',
    'role',
    'action',
  ];
  dataSource = new MatTableDataSource<User>();
  isFilterCleared = true;
  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private toast: ToastService,
    public dialog: MatDialog,
    private sortArray: SortArrayPipe
  ) {}

  userDataSubscription!: Subscription;
  ngOnInit() {
    this.isLoading = true;
    /** get the user data */
    this.userDataSubscription = this.userService
      .getUserData()
      .subscribe((res) => {
        if (res && res.length !== 0)
          this.dataSource.data = this.sortArray.transform(res, 'employeeId');
        this.isLoading = false;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

  }

  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * apply filter to the datasource
   * @param filterInput - reference to the input element
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * opens the dialog for adding a new user
   */
  onAddNewUser() {
    this.dialog.open(UserFormComponent, {
      data: null,
    });
  }

  /**
   * opens a dialog to edit existing user
   * @param user - object containing the user data
   */
  onEditUser(user: User) {
    this.dialog.open(UserFormComponent, {
      data: user,
    });
  }

  /**
   * opens the fialog to ask for confiramtion
   * before deleting the existing user
   * @param id - uid/localid of the user
   * @param employeeId - employee id of the user to display in the confirmation dialog
   */
  onDeleteUser(id: string, employeeId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        bodyText: `User with Employee Id ${employeeId.toUpperCase()} will be deleted. Are uou sure?`,
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.userService.getAllUsers();
            this.toast.show('User Deleted Successfully', 'success');
          },
          error: (err) => {
            this.toast.show(err.error.error.message, 'error', true);
          },
        });
      }
    });
  }

  trackById(index: number, item: User) {
    return item.employeeId;
  }

  ngDestroy() {
    /**
     * unsubscribe from all the subscriptions
     */
    this.userDataSubscription.unsubscribe();
  }
}
