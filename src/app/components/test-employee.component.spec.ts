import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEmployeeComponent } from './test-employee.component';

describe('TestEmployeeComponent', () => {
  let component: TestEmployeeComponent;
  let fixture: ComponentFixture<TestEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestEmployeeComponent]
    });
    fixture = TestBed.createComponent(TestEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
