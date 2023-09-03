import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Holiday } from 'src/app/models/holiday';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { HolidaysFormComponent } from '../holidays-form/holidays-form.component';

@Component({
  selector: 'app-holidays-view',
  templateUrl: './holidays-view.component.html',
  styleUrls: ['./holidays-view.component.scss']
})
export class HolidaysViewComponent implements OnInit {
  data!: any;

  displayedColumns: string[] = ['title', 'description', 'date', 'type', 'action'];
  dataSource!: MatTableDataSource<any>;
  isFilterCleared = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private holidayService: HolidayService) {
  }

  ngOnInit() {
    this.holidayService.getHolidayData().subscribe({
      next: res => {
        console.log("Holidays \n", res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
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

  onAddHoliday() {
    const dialogRef = this.dialog.open(HolidaysFormComponent, {
      data: null
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("Res");
    });
  }

  onEditHoliday(holiday: Holiday) {
    const dialogRef = this.dialog.open(HolidaysFormComponent, {
      data: holiday
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log("Dialog res : ", res);
    });
  }

  onDeleteHoliday(id: string, title: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Holiday',
        bodyText: `${title} will be deleted. Are you sure?`,
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.holidayService.deleteHoliday(id).subscribe({
          next: res => {
            console.log(res);
            this.holidayService.isUpdated$.next(true);
          },
          error: err => console.error(err)
        });
      }
    });
  }
}
