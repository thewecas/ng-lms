import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let service: jasmine.SpyObj<AuthService>;
  beforeEach(() => {
    service = jasmine.createSpyObj(
      ['getUserName', 'getUserRole'],
      ['isAdmin$', 'currentUser']
    );
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        MatDialogModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    });

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title to NewTitle', () => {
    component.setTitle('NewTitle');
    component.toggleable = false;

    expect(component.title).toBe('NewTitle');
  });
});
