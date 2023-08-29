import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lms';
  isLoading: boolean = true;
  constructor(private authService: AuthService) {
    authService.isValidSession();
    authService.isLoading$.subscribe(
      res => {
        this.isLoading = res;
      },
    );

  }
}
