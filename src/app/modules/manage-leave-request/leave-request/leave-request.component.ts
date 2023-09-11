import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent {
  displayedColumns: string[] = ['employeeId', 'fromDate', 'toDate', 'reason', 'type', 'status', 'action'];
  dataSource!: MatTableDataSource<any>;
  isFilterCleared = true;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private leaveService: LeaveService, private toast: ToastService) {

  }

  leaveDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;
  ngOnInit() {
    this.leaveDataSubscription = this.leaveService.getLeavesData().subscribe(
      (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
    this.isUpdatedSubscription = this.leaveService.isUpdated$.subscribe(res => {
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onUpdateStatus(uid: string, leaveId: string, status: 'Approved' | 'Rejected') {
    this.leaveService.updateStatus(uid, leaveId, status).subscribe({
      next: res => {
        console.log(res);
        this.toast.show(`Leave ${status} successfuly`, 'success');
      },
      error: err => this.toast.show(err.error.error.message, 'error', true)
    }

    );

  }
  ngOnDestroy() {
    this.leaveDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }
}
