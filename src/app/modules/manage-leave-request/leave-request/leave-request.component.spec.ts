import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { LeaveService } from 'src/app/services/leave/leave.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LeaveRequestComponent } from './leave-request.component';

describe('LeaveRequestComponent', () => {
  let component: LeaveRequestComponent;
  let fixture: ComponentFixture<LeaveRequestComponent>;
  let service: jasmine.SpyObj<LeaveService>;
  let toast: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    service = jasmine.createSpyObj(['getAllLeaves', 'getLeavesData']);
    toast = jasmine.createSpyObj(['']);

    TestBed.configureTestingModule({
      declarations: [LeaveRequestComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
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
      ],
    });
    fixture = TestBed.createComponent(LeaveRequestComponent);
    component = fixture.componentInstance;
    service.getLeavesData.and.returnValue(of(null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
