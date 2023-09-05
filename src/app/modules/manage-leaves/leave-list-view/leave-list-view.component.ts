import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Leave } from 'src/app/models/leave';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { LeaveFormComponent } from '../leave-form/leave-form.component';

@Component({
  selector: 'app-leave-list-view',
  templateUrl: './leave-list-view.component.html',
  styleUrls: ['./leave-list-view.component.scss']
})
export class LeaveListViewComponent implements OnInit {
  displayedColumns: string[] = ['fromDate', 'toDate', 'reason', 'type', 'status', 'action'];
  dataSource!: MatTableDataSource<Leave>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  uid!: string;
  constructor(private leaveService: LeaveService, private dialog: MatDialog, private authService: AuthService) {
    this.uid = authService.getUserId();
    console.log("uid?? : ", this.uid);

  }
  ngOnInit() {
    this.leaveService.getLeavesByUser(this.uid).subscribe({
      next: (res: any) => {

        console.log(res);


        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
            });

        }
      }
    );
  }

}
