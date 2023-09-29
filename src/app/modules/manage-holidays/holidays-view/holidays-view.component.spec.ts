import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HolidaysViewComponent } from './holidays-view.component';

describe('HolidaysViewComponent', () => {
  let component: HolidaysViewComponent;
  let fixture: ComponentFixture<HolidaysViewComponent>;
  let service: jasmine.SpyObj<HolidayService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj(['getHolidayData']);
    TestBed.configureTestingModule({
      declarations: [HolidaysViewComponent],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
      ],

      providers: [
        {
          provide: HolidayService,
          useValue: serviceSpy,
        },
        ToastService,
        SortArrayPipe,
      ],
    });

    fixture = TestBed.createComponent(HolidaysViewComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(HolidayService) as jasmine.SpyObj<HolidayService>;
    service.getHolidayData.and.returnValue(of(null));

    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
});
