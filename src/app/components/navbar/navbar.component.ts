import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isAdmin$!: BehaviorSubject<boolean>;
  username!: string;
  role!: string;
  toggleable!: boolean;
  title!: string;
  date = new Date();

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private route: Router
  ) {}

  ngOnInit() {
    this.username = this.authService.getUserName();
    this.role = this.authService.getUserRole();
    this.isAdmin$ = this.authService.isAdmin$;

    this.isHandset$.subscribe((res) => {
      this.toggleable = res;
    });

    this.title = this.route.url.replaceAll('-', ' ').substring(1);
    this.title = this.title
      .split(' ')
      .map(
        (word) =>
          word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase()
      )
      .join(' ');
  }

  @ViewChild('drawer') sidebar: any;
  private breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  /**
   * toggle sidebar
   */
  toggleSidebar() {
    this.sidebar.toggle();
  }

  setTitle(title: string) {
    this.title = title;
    if (this.toggleable) this.toggleSidebar();
  }

  /**
   * Call the logout fn from auth service
   */
  onLogout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Sign Out',
        bodyText: "You'll be signed out from this website. Are you sure ?",
        primaryAction: 'Confirm',
        secondaryAction: 'Cancel',
        btnColor: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.authService.logout();
      }
    });
  }
}
