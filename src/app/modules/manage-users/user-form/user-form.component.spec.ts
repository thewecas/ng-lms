import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let service: jasmine.SpyObj<UserService>;
  let toast: jasmine.SpyObj<ToastService>;
  let auth: jasmine.SpyObj<AuthService>;
  beforeEach(() => {
    service = jasmine.createSpyObj(['']);
    toast = jasmine.createSpyObj(['']);
    auth = jasmine.createSpyObj(['getEmployeeId', 'getUserId']);
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
          useValue: service,
        },
        {
          provide: ToastService,
          useValue: toast,
        },
        {
          provide: AuthService,
          useValue: auth,
        },
      ],
    });
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
