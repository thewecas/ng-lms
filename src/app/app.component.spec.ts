import {} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';

describe('AppComponent', () => {
  let service: jasmine.SpyObj<AuthService>;
  let component: AppComponent;
  beforeEach(() => {
    service = jasmine.createSpyObj([''], ['isLoading$']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    });

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'lms'`, () => {
    expect(component.title).toEqual('lms');
  });
});
