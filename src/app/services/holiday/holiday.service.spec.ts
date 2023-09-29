import { TestBed } from '@angular/core/testing';

import { FirebaseService } from '../firebase/firebase.service';
import { HolidayService } from './holiday.service';

describe('HolidayService', () => {
  let service: HolidayService;
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
    service = TestBed.inject(HolidayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
