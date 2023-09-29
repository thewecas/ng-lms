import { TestBed } from '@angular/core/testing';
import { FirebaseService } from '../firebase/firebase.service';
import { UserService } from './user.service';

describe('UsersService', () => {
  let service: UserService;
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
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
