import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lms';
  isSidebarOpen = false;
  isAuthenticated$: BehaviorSubject<boolean>;
  constructor(private authService: AuthService) {
    this.isAuthenticated$ = authService.isAuthenticated$;
  }
}
