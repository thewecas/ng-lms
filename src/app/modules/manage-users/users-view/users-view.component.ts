import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
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

  constructor(private userService: UserService, public dialog: MatDialog) {

  }

  userDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;
  ngOnInit() {
    this.userDataSubscription = this.userService.getUserData().subscribe(
      res => {
        this.dataSource = new MatTableDataSource(res);
        console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );

    this.isUpdatedSubscription = this.userService.isUpdated$.subscribe(res => {
      this.userService.gethAllUsers();
    });
  }


  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
    }
  }


  applyFilter(filterInput: HTMLInputElement) {
    const filterValue = filterInput.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter(filterInput: HTMLInputElement) {
    filterInput.value = '';
    this.applyFilter(filterInput);
  }

  onAddNewUser() {
    console.log("clicked");
    const dialogRef = this.dialog.open(UserFormComponent, {
      data: null
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("Dialog res : ", res);

    });
  }

  onEditUser(user: any) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      data: user
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("Dialog res : ", res);
    });
  }

  onDeleteUser(id: string, employeeId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Delete User",
        bodyText: `User with Employee Id ${employeeId.toUpperCase()} will be deleted. Are uou sure?`,
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.userService.deleteUser(id).subscribe({
          next: res => {
            console.log(res);
            this.userService.isUpdated$.next(true);
          },
          error: err => console.error(err)
        });
      }
    });
  }


  ngDestroy() {
    this.userDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }


}
