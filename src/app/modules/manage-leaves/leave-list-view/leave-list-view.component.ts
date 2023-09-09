import { } from '@angular/compiler';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Leave } from 'src/app/models/leave';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { LeaveFormComponent } from '../leave-form/leave-form.component';

@Component({
  selector: 'app-leave-list-view',
  templateUrl: './leave-list-view.component.html',
  styleUrls: ['./leave-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveListViewComponent implements OnInit {
  displayedColumns: string[] = ['fromDate', 'toDate', 'reason', 'type', 'status', 'action'];
  dataSource!: MatTableDataSource<Leave>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  uid!: string;
  constructor(private leaveService: LeaveService, private dialog: MatDialog, private authService: AuthService) {
  }

  leaveDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;

  ngOnInit() {
    this.uid = this.authService.getUserId();
    this.leaveDataSubscription = this.leaveService.getLeavesByUser(this.uid).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
    this.leaveService.isUpdated$.subscribe(res => {
      console.log("Leaves update triggered \n", res);
      this.leaveService.getAllLeaves();
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


  onApplyLeave() {
    const dialogRef = this.dialog.open(LeaveFormComponent);

  }

  onEditLeave(leave: Leave) {
    const dialogRef = this.dialog.open(LeaveFormComponent, {
      data: leave
    });

  }

  onDeleteLeave(uid: string, leaveId: string, fromDate: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Cancel Leave",
        bodyText: `You're leave on ${(new Date(fromDate)).toDateString()} will be canceled. Are uou sure?`,
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (res) {
          console.log("REsponse ", res);
          console.log("Deleting uid", uid, "\n leaveid:", leaveId);

          this.leaveService.deleteLeave(uid, leaveId).subscribe(
            res => {
              console.log(res);
              this.leaveService.isUpdated$.next(true);

            });

        }
      }
    );
  }

}
