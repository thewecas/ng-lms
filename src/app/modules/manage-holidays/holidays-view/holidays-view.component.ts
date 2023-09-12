import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Holiday } from 'src/app/models/holiday';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { ToastService } from 'src/app/services/toast/toast.service';
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
  activeTab!: string;

  isLoading = false;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private toast: ToastService, private holidayService: HolidayService) { }

  holidayDataSubscription!: Subscription;
  isUpdatedSubscription!: Subscription;
  data!: any[];


  ngOnInit() {
    /**
     * fetch the data from database 
     */
    this.isLoading = true;
    this.holidayDataSubscription = this.holidayService.getHolidayData().subscribe({
      next: res => {
        this.data = res;
        this.filterHolidayByStatus('upcoming');
        this.isLoading = false;
      }
    });

    this.isUpdatedSubscription = this.holidayService.isUpdated$.subscribe(
      res => {

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


  filterHolidayByStatus(status: string) {
    this.activeTab = status;
    if (status == 'upcoming') {
      this.dataSource = new MatTableDataSource(
        this.data.filter(holiday => new Date().getTime() <= holiday.date)
      );
    }
    else if (status == "recent") {
      this.dataSource = new MatTableDataSource(
        this.data.filter(holiday => new Date().getTime() > holiday.date)
      );

    }
    else
      this.dataSource = new MatTableDataSource(this.data);
    this.ngAfterViewInit();
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onAddHoliday() {
    this.dialog.open(HolidaysFormComponent, {
      data: null
    });
  }

  onEditHoliday(holiday: Holiday) {
    this.dialog.open(HolidaysFormComponent, {
      data: holiday
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
            this.toast.show("Holiday deleted successfuly", 'success');
          },
          error: err => this.toast.show("Holiday deleted successfuly", 'success')
        });
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this.holidayDataSubscription.unsubscribe();
    this.isUpdatedSubscription.unsubscribe();
  }

  sortData(isAscending: boolean = false) {
    this.data.sort((holiday1: Holiday, holiday2: Holiday) => {
      return (isAscending ? holiday1.date - holiday2.date : holiday2.date - holiday1.date) > 0 ? 1 : -1;
    });
  }


}
