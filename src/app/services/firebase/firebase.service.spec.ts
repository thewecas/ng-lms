import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';
import { FirebaseService } from './firebase.service';

describe('FirebaseService', () => {
  let service: FirebaseService;
  let http: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    http = jasmine.createSpyObj(['get', 'post', 'delete', 'put']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: http,
        },
      ],
    });
    service = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
