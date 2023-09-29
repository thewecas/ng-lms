import { TestBed } from '@angular/core/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let service: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    service = jasmine.createSpyObj(['getIdToken']);
    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
