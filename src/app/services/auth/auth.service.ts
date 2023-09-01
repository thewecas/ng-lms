import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  constructor(private router: Router) { }

  login(useCredentials: { email: string, password: String; }) {
    this.isAuthenticated$.next(true);
  }
}
