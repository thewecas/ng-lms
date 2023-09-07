import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Holiday } from 'src/app/models/holiday';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { HolidaysFormComponent } from '../holidays-form/holidays-form.component';

@Component({
  selector: 'app-holidays-view',
  templateUrl: './holidays-view.component.html',
  styleUrls: ['./holidays-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HolidaysViewComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['title', 'description', 'date', 'type', 'action'];
  dataSource!: MatTableDataSource<any>;
  isFilterCleared = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('toggleHolidays') holidayToggle!: MatButtonToggleGroup;

  constructor(private dialog: MatDialog, private holidayService: HolidayService) { }

  holidayDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;
  data!: any[];

  ngOnInit() {
    this.holidayDataSubscription = this.holidayService.getHolidayData().subscribe({
      next: res => {
        this.data = res;
        console.log("Holiday ", res);

        this.dataSource = new MatTableDataSource(res);
        console.log(this.dataSource.sortData);
        this.dataSource.sort = new MatSort();
        this.dataSource.sort.active = 'date';


        this.dataSource.paginator = this.paginator;
      }
    });

    this.isUpdatedSubscription = this.holidayService.isUpdated$.subscribe(
      res => {
        console.log("Holidays update triggered \n", res);

        this.holidayService.getAllHolidays();
      }
    );

  }
  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
    } catch (error) {

    }
  }

  toggleHolidayType() {
    if (this.holidayToggle.value == 'upcoming')
      this.dataSource = new MatTableDataSource(this.getUpcomingHolidays(this.data));
    else if (this.holidayToggle.value == 'recent')
      this.dataSource = new MatTableDataSource(this.getRecentHolidays(this.data));
    else
      this.dataSource = new MatTableDataSource(this.data);
    this.ngAfterViewInit();
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
            this.holidayService.isUpdated$.next(true);
          },
          error: err => console.error(err)
        });
      }
    });
  }

  logData() {
    console.log(this.dataSource._pageData(this.dataSource.filteredData));

  }

  trackById(index: number, item: any) {
    return item.id;
  }

  getUpcomingHolidays(holidays: Holiday[]): any[] {
    const arr = holidays.filter(holiday => {
      return new Date().getTime() <= holiday.date;
    });
    return arr;
  }

  getRecentHolidays(holidays: Holiday[]): any[] {
    const arr = holidays.filter(holiday => {
      return new Date().getTime() > holiday.date;
    });
    return arr;
  }


  ngOnDestroy() {
    this.holidayDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }


}
