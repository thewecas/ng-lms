import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],

})
export class NavbarComponent {

  @ViewChild('drawer') sidebar: any;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isAdmin$!: BehaviorSubject<boolean>;
  constructor(private authService: AuthService) {
    this.isAdmin$ = authService.isAdmin$;
  }

  toggleSidebar() {
    this.sidebar.toggle();
  }

  onLogout() {
    this.authService.logout();
  }
}
