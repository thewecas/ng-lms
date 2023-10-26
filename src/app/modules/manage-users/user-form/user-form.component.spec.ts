import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let service: jasmine.SpyObj<UserService>;
  let toast: jasmine.SpyObj<ToastService>;
  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj([
      'addNewUser',
      'updateUser',
      'getAllUsers',
      'checkEmployeeIdTaken',
    ]);
    const toastSpy = jasmine.createSpyObj(['show']);
    TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatRadioModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: null,
        },
        {
          provide: UserService,
          useValue: serviceSpy,
        },
        {
          provide: ToastService,
          useValue: toastSpy,
        },
      ],
    });
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    toast = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  const user = {
    uid: '12312w',
    idToken: 'sdsd43ws',
    refreshToken: '1212121212',
    employeeId: 'pw001',
    name: 'Employee',
    email: 'employee@gmail.com',
    role: 'employee',
    designation: 'Employee',
    isDeleted: false,
  };

  function initializeUserObject() {
    component.user = user;
    component.ngOnInit();
  }

  function initializeUserObjectToNull() {
    component.user = null;
    component.ngOnInit();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("shuould set the title to 'New User' when User obj is NULL ", () => {
    initializeUserObjectToNull();

    expect(component.title).toEqual('New User');
  });

  it("shuould set the title to 'Edit User' when User obj is NOT NULL ", () => {
    initializeUserObject();

    expect(component.title).toEqual('Edit User');
  });

  describe('Form Initilaization', () => {
    it('should create a form with 7 controls (employeeId, name, email, designation, password, confirmpassword) and make them required when User obj is NULL', () => {
      expect(component.userForm.contains('employeeId'));
      component.userForm.get('employeeId')?.setValue('');
      expect(component.userForm.get('employeeId')?.valid).toBeFalsy();

      expect(component.userForm.contains('name'));
      component.userForm.get('name')?.setValue('');
      expect(component.userForm.get('name')?.valid).toBeFalsy();

      expect(component.userForm.contains('email'));
      component.userForm.get('email')?.setValue('');
      expect(component.userForm.get('email')?.valid).toBeFalsy();

      expect(component.userForm.contains('designation'));
      component.userForm.get('designation')?.setValue('');
      expect(component.userForm.get('designation')?.valid).toBeFalsy();

      expect(component.userForm.contains('password'));
      component.userForm.get('password')?.setValue('');
      expect(component.userForm.get('password')?.valid).toBeFalsy();

      expect(component.userForm.contains('confirmPassword'));
      component.userForm.get('confirmPassword')?.setValue('');
      expect(component.userForm.get('confirmPassword')?.valid).toBeFalsy();
    });

    it('should create a form with 5 controls (employeeId, name, email, designation) and make them required when User obj is NOT NULL', () => {
      expect(component.userForm.contains('employeeId'));
      component.userForm.get('employeeId')?.setValue('');
      expect(component.userForm.get('employeeId')?.valid).toBeFalsy();

      expect(component.userForm.contains('name'));
      component.userForm.get('name')?.setValue('');
      expect(component.userForm.get('name')?.valid).toBeFalsy();

      expect(component.userForm.contains('email'));
      component.userForm.get('email')?.setValue('');
      expect(component.userForm.get('email')?.valid).toBeFalsy();

      expect(component.userForm.contains('designation'));
      component.userForm.get('designation')?.setValue('');
      expect(component.userForm.get('designation')?.valid).toBeFalsy();
    });
  });

  it('should call the AddNewUser method on submit when the  User obj is NULL ', () => {
    initializeUserObjectToNull();
    service.addNewUser.and.returnValue(of(user));

    component.onSubmit();

    expect(service.addNewUser).toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalled();
  });

  it('should call the updateUser method on submit when the  User obj is NOT NULL ', () => {
    initializeUserObject();
    service.updateUser.and.returnValue(of(user));

    component.onSubmit();

    expect(service.updateUser).toHaveBeenCalled();
    expect(toast.show).toHaveBeenCalled();
  });

  it('should call the isEmployeeIdExist validator fn, when employee id is set to some value', (done: DoneFn) => {
    initializeUserObjectToNull();
    const spy = spyOn(component, 'isEmployeeIdExist');
    service.checkEmployeeIdTaken.and.returnValue(
      of({
        ket: 'val',
      })
    );
    const control = component.userForm.get('employeeId');
    control?.setValue('');

    const field: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector('#employeeId');

    // field.addEventListener('blur', () => {

    // });
    field.dispatchEvent(new Event('blur'));
    field.blur();
    fixture.whenStable().then(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });

    // console.log('Error Case', control?.hasError('employeeIdTaken'));

    // expect(control?.hasError('employeeIdTaken')).toBeTruthy();

    // expect(spy).toHaveBeenCalled();

    // fixture.whenStable().then(() => {
    // });
  });
});
