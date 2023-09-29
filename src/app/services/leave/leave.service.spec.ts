import { TestBed } from '@angular/core/testing';

import { FirebaseService } from '../firebase/firebase.service';
import { LeaveService } from './leave.service';

describe('LeaveService', () => {
  let service: LeaveService;
  let fireServie: jasmine.SpyObj<FirebaseService>;

  beforeEach(() => {
    fireServie = jasmine.createSpyObj(['']);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FirebaseService,
          useValue: fireServie,
        },
      ],
    });
    service = TestBed.inject(LeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
