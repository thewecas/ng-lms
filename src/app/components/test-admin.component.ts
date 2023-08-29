import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-test-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h2>Admin</h2>
    <button (click)="go()">goto employee</button>
    <button (click)="goAuth()">goto auth</button>
    <button (click)="onSignOut()">SignOut</button>


  `,
  styles: [
  ]
})
export class TestAdminComponent {
  constructor(private router: Router, private authService: AuthService) {
    console.log("Admin Component");

  }

  go() {
    this.router.navigate(['/employee']);
  }

  goAuth() {
    this.router.navigate(['/auth']);
  }

  onSignOut() {
    this.authService.onSignOut();
  }
}
