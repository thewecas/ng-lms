import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LeaveFormComponent } from './leave-form.component';

describe('LeaveFormComponent', () => {
  let component: LeaveFormComponent;
  let fixture: ComponentFixture<LeaveFormComponent>;
  let service: jasmine.SpyObj<LeaveService>;
  let toast: jasmine.SpyObj<ToastService>;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj([
      'addLeave',
      'editLeave',
      'getAllLeaves',
      'fetchLeavesByUser',
    ]);
    const toastSpy = jasmine.createSpyObj(['show']);
    const authSpy = jasmine.createSpyObj([
      'getEmployeeId',
      'getUserId',
      'getUserRole',
    ]);

    TestBed.configureTestingModule({
      declarations: [LeaveFormComponent],
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatOptionModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: null,
        },
        {
          provide: LeaveService,
          useValue: serviceSpy,
        },
        {
          provide: ToastService,
          useValue: toastSpy,
        },
        {
          provide: AuthService,
          useValue: authSpy,
        },
      ],
    });

    fixture = TestBed.createComponent(LeaveFormComponent);
    service = TestBed.inject(LeaveService) as jasmine.SpyObj<LeaveService>;
    toast = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    auth = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const leave = {
    fromDate: new Date().getTime(),
    toDate: new Date().getTime(),
    reason: 'Important Meeting',
    type: 'Casual',
    status: 'Pending',
    uid: '12222',
    leaveId: '121212',
    employeeId: 'pw001',
    isDeleted: false,
  };

  function initializeLeaveObject() {
    component.leave = leave;
    component.ngOnInit();
  }

  function initializeLeaveObjectToNull() {
    component.leave = null;
    component.ngOnInit();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should set the title to 'Apply Leave' when Leave obj is null", () => {
    initializeLeaveObjectToNull();

    expect(component.title).toEqual('Apply Leave');
  });

  it("should set the title to 'Edit leave' when Leave obj is NOT null", () => {
    initializeLeaveObject();

    expect(component.title).toEqual('Edit Leave');
  });

  it('should create a form with 4 controls (fromDate, toDate, reason, type) and make them required', () => {
    expect(component.leaveForm.contains('fromDate'));
    component.leaveForm.get('fromDate')?.setValue('');
    expect(component.leaveForm.get('fromDate')?.valid).toBeFalsy();

    expect(component.leaveForm.contains('toDate'));
    component.leaveForm.get('toDate')?.setValue('');
    expect(component.leaveForm.get('toDate')?.valid).toBeFalsy();

    expect(component.leaveForm.contains('reason'));
    component.leaveForm.get('reason')?.setValue('');
    expect(component.leaveForm.get('reason')?.valid).toBeFalsy();

    expect(component.leaveForm.contains('type'));
    component.leaveForm.get('type')?.setValue('');
    expect(component.leaveForm.get('type')?.valid).toBeFalsy();
  });

  it('should set the form control values to the given leave object', () => {
    initializeLeaveObject();

    expect(component.leaveForm.get('fromDate')?.value).toEqual(
      component.leave?.fromDate
    );
    expect(component.leaveForm.get('toDate')?.value).toEqual(
      component.leave?.toDate
    );
    expect(component.leaveForm.get('reason')?.value).toEqual(
      component.leave?.reason
    );
    expect(component.leaveForm.get('type')?.value).toEqual(
      component.leave?.type
    );
  });

  it('should call the addLeave method on submit when the Leave object is null', () => {
    initializeLeaveObjectToNull();
    service.addLeave.and.returnValue(
      of({
        name: 'user name',
      })
    );
    auth.getUserRole.and.returnValue('admin');

    component.onSubmit();

    expect(service.addLeave).toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalled();
  });

  it('should call editLeave method when the Leave Object is NOT null', () => {
    initializeLeaveObject();
    service.editLeave.and.returnValue(of(leave));

    component.onSubmit();

    expect(service.editLeave).toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalled();
  });
});
