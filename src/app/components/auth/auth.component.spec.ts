import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let service: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const serviceSpy = jasmine.createSpyObj('AuthService', ['login']);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        {
          provide: AuthService,
          useValue: serviceSpy,
        },
      ],
    });
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should call login method on clicking submit button', () => {
    const userCredentials = {
      email: 'test@mail.com',
      password: '123456',
    };
    component.signInForm.setValue(userCredentials);

    const btn: HTMLButtonElement | null =
      fixture.debugElement.nativeElement.querySelector('.signInBtn');

    btn?.click();

    fixture.whenStable().then(() => {
      expect(spyOn(component, 'onSubmit')).toHaveBeenCalled();
    });
  });

  it('should call login method on submit', () => {
    const userCredentials = {
      email: 'test@mail.com',
      password: '123456',
    };
    component.signInForm.setValue(userCredentials);

    component.onSubmit();

    expect(service.login).toHaveBeenCalled();
  });
});
