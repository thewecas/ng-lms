import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersViewComponent implements AfterViewInit {
  displayedColumns: string[] = ['employeeId', 'name', 'email', 'designation', 'role', 'action'];
  dataSource!: MatTableDataSource<any>;
  isFilterCleared = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private toast: ToastService, public dialog: MatDialog) {
  }

  userDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;
  ngOnInit() {
    /** get the user data */
    this.userDataSubscription = this.userService.getUserData().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );

    /**  refetches the data for each value emited by the isUpdated observable */
    this.isUpdatedSubscription = this.userService.isUpdated$.subscribe(res => {
      this.userService.getAllUsers();
    });
  }


  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
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
      data: null
    });
  }

  /**
   * opens a dialog to edit existing user 
   * @param user - object containing the user data
   */
  onEditUser(user: any) {
    this.dialog.open(UserFormComponent, {
      data: user
    });
  }

  /**
   * opens the fialog to ask for confiramtion 
   * before deleting the existing user
   * @param id - uid/localid of the user
   * @param employeeId - employee id of the user to display in the confirmation dialog
   */
  onDeleteUser(id: string, employeeId: string) {
    const dialogRef = this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: "Delete User",
          bodyText: `User with Employee Id ${employeeId.toUpperCase()} will be deleted. Are uou sure?`,
          primaryAction: 'Confirm',
          secondaryAction: 'Cancel',
          btnColor: 'warn'
        }
      });

    dialogRef
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.userService.deleteUser(id).subscribe({
            next: res => {
              this.userService.isUpdated$.next(true);
              this.toast.show('User Deleted Successfully', 'success');
            },
            error: err => {
              this.toast.show(err.error.error.message, 'error', true);
            }
          });
        }
      });
  }

  ngDestroy() {
    /**
     * unsubscribe from all the observables
     */
    this.userDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }


}
