import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private currentUser!: any;
  expirationTime: number = 3600 * 60;


  constructor(private router: Router, private firebase: FirebaseService) { }

  login(useCredentials: { email: string, password: string; }) {
    this.firebase.signInUser(useCredentials)
      .subscribe((res: any) => {
        console.log(res.idToken);
        this.storeUserToLocalStorage(res.idToken);
      });
    this.isAuthenticated$.next(true);
  }


  storeUserToLocalStorage(idToken: string) {
    localStorage.setItem('lms-userIdToken', idToken);
  }

  fetchUserFromLocalStorage() {
    return localStorage.getItem('lms-userIdToken');
  }

  logout() {
    localStorage.removeItem('lms-userIdToken');
    this.isAuthenticated$.next(false);
  }

  checkIsAuthenticUser() {
    const idToken = this.fetchUserFromLocalStorage();
    if (!!idToken) {
      this.firebase.lookupUser(idToken).subscribe({
        next: (res: any) => {
          let lastLoginAt = res.users[0].lastLoginAt;
          let isValid = (new Date().getTime() - lastLoginAt) < this.expirationTime;
          if (isValid) {
            this.isAuthenticated$.next(true);
            console.log("Valid session");
          }
          else {
            console.log("navigating");
            this.isAuthenticated$.next(false);
            console.log("Session expired");
          }
        },
      });
    }
    else {
      this.isAuthenticated$.next(false);
      console.log("Invalid Session");
    }
  }
}
