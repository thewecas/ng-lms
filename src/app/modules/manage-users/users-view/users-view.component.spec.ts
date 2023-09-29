import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { SortArrayPipe } from 'src/app/pipes/sort-array.pipe';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { UsersViewComponent } from './users-view.component';

describe('ViewUsersComponent', () => {
  let component: UsersViewComponent;
  let fixture: ComponentFixture<UsersViewComponent>;
  let service: jasmine.SpyObj<UserService>;
  let toast: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    service = jasmine.createSpyObj(['getUserData']);
    toast = jasmine.createSpyObj(['']);
    TestBed.configureTestingModule({
      declarations: [UsersViewComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule,
        MatPaginatorModule,
      ],
      providers: [
        SortArrayPipe,
        {
          provide: UserService,
          useValue: service,
        },
        {
          provide: ToastService,
          useValue: toast,
        },
      ],
    });
    fixture = TestBed.createComponent(UsersViewComponent);
    component = fixture.componentInstance;
    service.getUserData.and.returnValue(of(null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
