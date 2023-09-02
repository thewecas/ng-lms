import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysFormComponent } from './holidays-form.component';

describe('HolidaysFormComponent', () => {
  let component: HolidaysFormComponent;
  let fixture: ComponentFixture<HolidaysFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidaysFormComponent]
    });
    fixture = TestBed.createComponent(HolidaysFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
