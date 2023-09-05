import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveService } from 'src/app/services/leave/leave.service';

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

  constructor(private leaveService: LeaveService) {

  }

  ngOnInit() {
    this.leaveService.getLeavesData().subscribe(
      (res: any) => {
        console.log("Leaves \n", res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  onUpdateStatus(uid: string, leaveId: string, status: 'Approved' | 'Rejected') {
    this.leaveService.updateStatus(uid, leaveId, status).subscribe(
      res => {
        console.log(res);

      }
    );

  }

}
