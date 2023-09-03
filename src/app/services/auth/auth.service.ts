import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean | null>(null);
  private currentUser!: any;
  expirationTime: number = 3600 * 60;


  constructor(private router: Router, private firebase: FirebaseService) { }

  login(useCredentials: { email: string, password: string; }) {
    this.firebase.signInUser(useCredentials)
      .subscribe((res: any) => {
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
    this.router.navigate(['/']);
    this.isAuthenticated$.next(false);
  }

  checkIsAuthenticUser() {
    this.isAuthenticated$.next(true);
    // const idToken = this.fetchUserFromLocalStorage();
    // if (!!idToken) {
    //   this.firebase.lookupUser(idToken).subscribe({
    //     next: (res: any) => {
    //        let lastLoginAt = res.users[0].lastLoginAt;
    //        let isValid = (new Date().getTime() - lastLoginAt) < this.expirationTime;
    //        if (isValid) {
    //          this.isAuthenticated$.next(true);
    //          console.log("Valid session");
    //        }
    //        else {
    //          console.log("navigating");
    //          this.isAuthenticated$.next(false);
    //          console.log("Session expired");
    //          this.router.navigate(['/']);
    //        }
    //       this.isAuthenticated$.next(true);

    //     },
    //     error: (err) => {
    //       this.isAuthenticated$.next(false);
    //       this.router.navigate(['/']);
    //       console.log("Session Expired");

    //     }
    //   });
    // }
    // else {
    //   this.isAuthenticated$.next(false);
    //   console.log("Invalid Session");
    // }
  }
}
