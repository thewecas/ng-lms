/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,MatSnackBarModule]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).withContext('Login Component created').toBeTruthy();
  });


  it('should store the user refreshToken to local storage', () => {
    const token = 'myCustomTestingToken';

    service.storeUserToLocalStorage(token);

    expect(localStorage.getItem(service.tokenName)).toEqual(token);
  });

  it('should fetch the user refreshToken from local storage', () => {
    const token = 'myCustomTestingToken';

    localStorage.setItem(service.tokenName, token);

    expect(service.fetchUserFromLocalStorage()).toEqual(token);
  });
});
