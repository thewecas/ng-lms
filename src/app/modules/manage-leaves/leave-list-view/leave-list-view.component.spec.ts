import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveListViewComponent } from './leave-list-view.component';

describe('LeaveListViewComponent', () => {
  let component: LeaveListViewComponent;
  let fixture: ComponentFixture<LeaveListViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveListViewComponent]
    });
    fixture = TestBed.createComponent(LeaveListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
