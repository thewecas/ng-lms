import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  @ViewChild('drawer') sidebar: any;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /** 
   *  display sidebar only when the isAdmin$ value is true
   */
  isAdmin$!: BehaviorSubject<boolean>;
  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.isAdmin$ = authService.isAdmin$;
  }

  /**
   * toggle sidebar
   */
  toggleSidebar() {
    this.sidebar.toggle();
  }

  /**
   * Call the logout fn from auth service
   */
  onLogout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Sing Out',
        bodyText: "You'll be signed out from this website. Are you sure ?",
        primaryAction: "Confirm",
        secondaryAction: "Cancel",
        btnColor: "primary"
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        console.log("closed");

        this.authService.logout();

      }
    });

  }
}
