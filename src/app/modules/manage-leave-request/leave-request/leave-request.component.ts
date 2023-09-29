import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { Leave } from 'src/app/models/leave';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveRequestComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'employeeId',
    'fromDate',
    'toDate',
    'reason',
    'type',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<Leave>();
  isFilterCleared = true;
  data!: Leave[];
  isLoading = false;

  leaves = {
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
  ngOnInit() {
    this.isLoading = true;
    this.leaveService.getAllLeaves();
    this.leaveDataSubscription = this.leaveService
      .getLeavesData()
      .subscribe((res: Leave[] | null) => {
        if (res) {
          this.data = res;
          this.isLoading = false;
          this.filterLeavesByStatus('pending');
        }
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
    if (status === 'pending')
      filteredData = this.data.filter((leave) => leave.status == 'Pending');
    else filteredData = this.data.filter((leave) => leave.status != 'Pending');
    if (filteredData.length !== 0)
      this.dataSource.data = this.sortArray.transform(
        filteredData,
        'fromDate',
        status == 'pending'
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

  getTotalDays(from: number, to: number) {
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
      next: () => {
        this.toast.show(`Leave ${status} successfuly`, 'success');
        this.leaveService.getAllLeaves();
      },
      error: (err) => this.toast.show(err.error.error.message, 'error', true),
    });
  }

  trackById(index: number, item: Leave) {
    return item.leaveId;
  }
  ngOnDestroy() {
    this.leaveDataSubscription.unsubscribe();
  }
}
