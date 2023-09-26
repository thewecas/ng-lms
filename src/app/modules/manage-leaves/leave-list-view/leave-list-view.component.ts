import { } from '@angular/compiler';
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
export class LeaveListViewComponent implements OnInit, AfterViewInit, OnDestroy {
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
    private readonly leaveService: LeaveService,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
    private readonly toast: ToastService,
    private readonly sortArray: SortArrayPipe
  ) {}

  leaveDataSubscription!: Subscription;

  ngOnInit() {
    this.isLoading = true;
    this.uid = this.authService.getUserId();
    this.leaveDataSubscription = this.leaveService
      .getLeavesByUser(this.uid)
      .subscribe({
        next: (res: Leave[] | null) => {
          if (res) {
            this.data = res;
            this.isLoading = false;
            this.filterLeavesByStatus('pending');
          }
        },
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
    let filteredData;
    if (status === 'pending')
      filteredData = this.data.filter((leave) => leave.status === 'Pending');
    else filteredData = this.data.filter((leave) => leave.status !== 'Pending');
    if (filteredData.length !== 0)
      this.dataSource.data = this.sortArray.transform(
        filteredData,
        'fromDate',
        status === 'pending'
      );
    else this.dataSource.data = [];
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
    return totalDays || 1;
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
          this.leaveService.fetchLeavesByUser(uid)
          this.toast.show('Leave withdrawn successfuly', 'success');
        });
      }
    });
  }

  trackById(_index: number, item: Leave) {
    return item.leaveId;
  }

  ngOnDestroy() {
    this.leaveDataSubscription.unsubscribe();
  }
}
