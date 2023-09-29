import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { HolidayService } from 'src/app/services/holiday/holiday.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { HolidaysFormComponent } from './holidays-form.component';

describe('HolidaysFormComponent', () => {
  let component: HolidaysFormComponent;
  let fixture: ComponentFixture<HolidaysFormComponent>;
  let service: jasmine.SpyObj<HolidayService>;
  let toast: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj([
      'addHoliday',
      'updateHoliday',
      'getAllHolidays',
    ]);
    toast = jasmine.createSpyObj(['show']);
    TestBed.configureTestingModule({
      declarations: [HolidaysFormComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: null,
        },
        {
          provide: HolidayService,
          useValue: serviceSpy,
        },

        {
          provide: ToastService,
          useValue: toast,
        },
      ],
    });
    fixture = TestBed.createComponent(HolidaysFormComponent);
    service = TestBed.inject(HolidayService) as jasmine.SpyObj<HolidayService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set title to 'New Holiday' when holiday object is null", () => {
    component.holiday = null;

    component.ngOnInit();

    expect(component.title).toBe('New Holiday');
  });

  it("should set title to 'Edit Holiday' when holiday object is NOT null", () => {
    component.holiday = {
      id: '121212',
      title: 'New holiday',
      description: 'Description for new holiday',
      date: new Date().getTime(),
      type: 'Restricted',
    };

    component.ngOnInit();

    expect(component.title).toBe('Edit Holiday');
  });

  it('should create a form with 4 controls (title, date, description, type) and make them required', () => {
    expect(component.holidayForm.contains('title')).toBeTruthy();
    component.holidayForm.get('title')?.setValue('');
    expect(component.holidayForm.get('title')?.valid).toBeFalsy();

    expect(component.holidayForm.contains('date')).toBeTruthy();
    component.holidayForm.get('date')?.setValue('');
    expect(component.holidayForm.get('date')?.valid).toBeFalsy();

    expect(component.holidayForm.contains('description')).toBeTruthy();
    component.holidayForm.get('description')?.setValue('');
    expect(component.holidayForm.get('description')?.valid).toBeFalsy();

    expect(component.holidayForm.contains('type')).toBeTruthy();
    component.holidayForm.get('type')?.setValue('');
    expect(component.holidayForm.get('type')?.valid).toBeFalsy();
  });

  it('should set the form control values to the given holiday object ', () => {
    component.holiday = {
      id: '121212',
      title: 'New holiday',
      description: 'Description for new holiday',
      date: new Date().getTime(),
      type: 'Restricted',
    };

    component.ngOnInit();

    expect(component.holidayForm.get('title')?.value).toEqual(
      component.holiday.title
    );
    expect(component.holidayForm.get('description')?.value).toEqual(
      component.holiday.description
    );
    expect(component.holidayForm.get('date')?.value).toEqual(
      new Date(component.holiday.date)
    );
    expect(component.holidayForm.get('type')?.value).toEqual(
      component.holiday.type
    );
  });

  it('should call addHoliday method on submit when holiday object is null', () => {
    service.addHoliday.and.returnValue(of(true));
    component.onSubmit();

    expect(service.addHoliday).toHaveBeenCalledTimes(1);
    expect(service.getAllHolidays).toHaveBeenCalledTimes(1);
    expect(toast.show).toHaveBeenCalledTimes(1);
  });

  it('should call update method on submit when holiday object is NOT null', () => {
    service.updateHoliday.and.returnValue(of(true));
    component.holiday = {
      id: '121212',
      title: 'New holiday',
      description: 'Description for new holiday',
      date: new Date().getTime(),
      type: 'Restricted',
    };

    component.onSubmit();

    expect(service.updateHoliday).toHaveBeenCalledTimes(1);
    expect(service.getAllHolidays).toHaveBeenCalledTimes(1);
    expect(toast.show).toHaveBeenCalledTimes(1);
  });
});
