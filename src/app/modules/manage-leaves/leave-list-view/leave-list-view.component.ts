import {} from '@angular/compiler';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Leave } from 'src/app/models/leave';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LeaveFormComponent } from '../leave-form/leave-form.component';

@Component({
  selector: 'app-leave-list-view',
  templateUrl: './leave-list-view.component.html',
  styleUrls: ['./leave-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveListViewComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayedColumns: string[] = [
    'fromDate',
    'toDate',
    'reason',
    'type',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Leave>();
  activeTab!: string;
  isLoading = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  uid!: string;
  data: Leave[] = [];

  constructor(
    private leaveService: LeaveService,
    private dialog: MatDialog,
    private authService: AuthService,
    private toast: ToastService,
    private sortArray: SortArrayPipe
  ) {}

  leaveDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;

  ngOnInit() {
    this.isLoading = true;
    this.uid = this.authService.getUserId();
    this.leaveDataSubscription = this.leaveService
      .getLeavesByUser(this.uid)
      .subscribe({
        next: (res: Leave[] | null) => {
          if (res) {
            this.data = res;
            this.filterLeavesByStatus('pending');
            this.isLoading = false;
          }
        },
      });
    this.isUpdatedSubscription = this.leaveService.isUpdated$.subscribe(() => {
      this.isLoading = true;
      this.leaveService.fetchLeavesByUser(this.uid);
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

  filterLeavesByStatus(status: string) {
    this.activeTab = status;
    let filteredData = this.data;
    if (status == 'pending')
      filteredData = this.data.filter((leave) => leave.status == 'Pending');
    else filteredData = this.data.filter((leave) => leave.status != 'Pending');
    this.dataSource.data = this.sortArray.transform(
      filteredData,
      'fromDate',
      status == 'pending'
    );
    this.ngAfterViewInit();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalDays(from: Date | number, to: Date | number) {
    const totalDays =
      Math.ceil(new Date(to).getTime() - new Date(from).getTime()) /
      (60 * 60 * 24 * 1000);
    return totalDays ? totalDays : 1;
  }

  onApplyLeave() {
    this.dialog.open(LeaveFormComponent);
  }

  onEditLeave(leave: Leave) {
    this.dialog.open(LeaveFormComponent, {
      data: leave,
    });
  }

  onDeleteLeave(uid: string, leaveId: string, fromDate: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Withdraw Leave',
        bodyText: `You're leave on ${new Date(
          fromDate
        ).toDateString()} will be Withdrawn. Are you sure?`,
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.leaveService.deleteLeave(uid, leaveId).subscribe(() => {
          this.leaveService.isUpdated$.next(true);
          this.toast.show('Leave withdrawn successfuly', 'success');
        });
      }
    });
  }

  trackById(index: number, item: Leave) {
    return item.leaveId;
  }

  ngOnDestroy() {
    this.leaveDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }
}
