import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LeaveListViewComponent } from './leave-list-view.component';

describe('LeaveListViewComponent', () => {
  let component: LeaveListViewComponent;
  let fixture: ComponentFixture<LeaveListViewComponent>;
  let service: jasmine.SpyObj<LeaveService>;
  let toast: jasmine.SpyObj<ToastService>;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    service = jasmine.createSpyObj(['getLeavesByUser']);
    toast = jasmine.createSpyObj(['']);
    auth = jasmine.createSpyObj(['getUserId']);
    TestBed.configureTestingModule({
      declarations: [LeaveListViewComponent],
      imports: [
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonToggleModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule,
      ],
      providers: [
        SortArrayPipe,
        {
          provide: LeaveService,
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
    fixture = TestBed.createComponent(LeaveListViewComponent);
    component = fixture.componentInstance;
    service.getLeavesByUser.and.returnValue(of(null));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
