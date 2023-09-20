import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveRequestComponent {
  displayedColumns: string[] = [
    'employeeId',
    'fromDate',
    'toDate',
    'reason',
    'type',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  isFilterCleared = true;
  data!: any[];
  isLoading = false;

  leaves: any = {
    Sick: 'SL',
    Casual: 'CL',
    Paternity: 'PL',
    PayOff: 'PO',
  };

  activeTab!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private leaveService: LeaveService,
    private toast: ToastService,
    private sortArray: SortArrayPipe
  ) {}

  leaveDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;
  ngOnInit() {
    this.isLoading = true;
    this.leaveService.getAllLeaves();
    this.leaveDataSubscription = this.leaveService
      .getLeavesData()
      .subscribe((res: any) => {
        this.data = res;
        this.filterLeavesByStatus('pending');
        this.isLoading = false;
      });
    this.isUpdatedSubscription = this.leaveService.isUpdated$.subscribe(
      (res) => {
        this.isLoading = true;
        this.leaveService.getAllLeaves();
      }
    );
  }

  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {}
  }

  filterLeavesByStatus(status: string) {
    this.activeTab = status;
    if (status == 'pending') {
      this.dataSource = new MatTableDataSource(
        this.sortArray
          .transform(this.data, 'fromDate', true)
          .filter((leave) => leave.status == 'Pending')
      );
    } else {
      this.dataSource = new MatTableDataSource(
        this.sortArray
          .transform(this.data, 'fromDate', false)
          .filter((leave) => leave.status != 'Pending')
      );
    }
    this.ngAfterViewInit();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getTotalDays(from: Date, to: Date) {
    const totalDays =
      Math.ceil(new Date(to).getTime() - new Date(from).getTime()) /
      (60 * 60 * 24 * 1000);
    return totalDays ? totalDays : 1;
  }

  onUpdateStatus(
    uid: string,
    leaveId: string,
    status: 'Approved' | 'Rejected'
  ) {
    this.leaveService.updateStatus(uid, leaveId, status).subscribe({
      next: (res) => {
        this.toast.show(`Leave ${status} successfuly`, 'success');
        this.leaveService.isUpdated$.next(true);
      },
      error: (err) => this.toast.show(err.error.error.message, 'error', true),
    });
  }

  trackById(index: number, item: any) {
    return item.leaveId;
  }
  ngOnDestroy() {
    this.leaveDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }
}
