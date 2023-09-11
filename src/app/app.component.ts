import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lms';
  isSidebarOpen = false;
  isLoading$: BehaviorSubject<boolean>;
  constructor(private authService: AuthService) {
    this.isLoading$ = authService.isLoading$;
  }
}
