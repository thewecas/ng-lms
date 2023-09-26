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
import { Holiday } from 'src/app/models/holiday';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HolidaysFormComponent } from '../holidays-form/holidays-form.component';

@Component({
  selector: 'app-holidays-view',
  templateUrl: './holidays-view.component.html',
  styleUrls: ['./holidays-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysViewComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'title',
    'description',
    'date',
    'type',
    'action',
  ];
  dataSource = new MatTableDataSource<Holiday>();
  activeTab!: string;

  isLoading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private readonly dialog: MatDialog,
    private readonly toast: ToastService,
    private readonly holidayService: HolidayService,
    private readonly sortArray: SortArrayPipe
  ) {}

  holidayDataSubscription!: Subscription;
  data!: Holiday[];

  ngOnInit() {
    console.log("onInit Called");
    
    /**
     * fetch the data from database
     */
    this.isLoading = true;
    this.holidayDataSubscription = this.holidayService
      .getHolidayData()
      .subscribe({
        next: (res) => {
          if (res) {
            this.data = res;
            this.isLoading = false;
            this.filterHolidayByStatus(this.activeTab);
          }
        },
      })
  }
  ngAfterViewInit() {
    try {
      this.dataSource.paginator = this.paginator;
    } catch (error) {
      console.log(error);
    }
  }

  filterHolidayByStatus(status = 'upcoming') {
    this.activeTab = status;
    let filteredData = this.data;
    if (status == 'upcoming') {
      filteredData = this.data.filter(
        (holiday) => new Date().getTime() <= holiday.date
      );
    } else if (status == 'recent') {
      filteredData = this.data.filter(
        (holiday) => new Date().getTime() > holiday.date
      );
    }
    if (filteredData.length !== 0)
      this.dataSource.data = this.sortArray.transform(
        filteredData,
        'date',
        this.activeTab !== 'recent'
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

  onAddHoliday() {
    this.dialog.open(HolidaysFormComponent, {
      data: null,
    });
  }

  onEditHoliday(holiday: Holiday) {
    this.dialog.open(HolidaysFormComponent, {
      data: holiday,
    });
  }

  onDeleteHoliday(id: string, title: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Holiday',
        bodyText: `${title} will be deleted. Are you sure?`,
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.holidayService.deleteHoliday(id).subscribe({
          next: () => {
            this.holidayService.getAllHolidays();
            this.toast.show('Holiday deleted successfuly', 'success');
          },
          error: () =>
            this.toast.show('Holiday deleted successfuly', 'success'),
        });
      }
    });
  }

  trackById(index: number, item: Holiday) {
    return item.id;
  }

  ngOnDestroy() {
    this.holidayDataSubscription.unsubscribe();
  }
}
