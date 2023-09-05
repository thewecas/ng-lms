import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new Subject<boolean>();
  private currentUser!: User;
  expirationTime: number = 60 * 60 * 60 * 60;
  isLoading$ = new BehaviorSubject<boolean>(false);


  constructor(private router: Router, private firebase: FirebaseService) { }

  login(useCredentials: { email: string, password: string; }) {
    this.isLoading$.next(true);
    this.firebase.signInUser(useCredentials)
      .subscribe({
        next: (res: any) => {
          this.storeUserToLocalStorage(res.idToken);
          this.getCurrentUser(res.localId).subscribe({
            next: (res: any) => {
              this.currentUser = { ...this.currentUser, ...res };
              this.isAuthenticated$.next(true);
              this.router.navigate(['/']);
              console.log(this.currentUser);
              this.isLoading$.next(false);
            }
          });
        },
        error: err => {
          this.isAuthenticated$.next(false);
          this.isLoading$.next(false);

        }
      });
  }


  storeUserToLocalStorage(idToken: string) {
    localStorage.setItem('lms-userIdToken', idToken);
  }

  fetchUserFromLocalStorage() {
    return localStorage.getItem('lms-userIdToken');
  }

  logout() {
    localStorage.removeItem('lms-userIdToken');
    this.router.navigate(['/login']);
    this.isAuthenticated$.next(false);
  }

  checkIsAuthenticUser() {
    this.isLoading$.next(true);

    const idToken = this.fetchUserFromLocalStorage();
    if (!!idToken) {
      this.firebase.lookupUser(idToken).subscribe({
        next: (res: any) => {
          console.log(res);

          let lastLoginAt = res.users[0].lastLoginAt;
          let isValid = (new Date().getTime() - lastLoginAt) < this.expirationTime;

          console.log("Session  ", (new Date().getTime() - lastLoginAt), "<", this.expirationTime);

          if (isValid) {
            console.log("LastLoginAt, ", new Date(Number(lastLoginAt)));
            const uid = res.users[0].localId;
            this.currentUser = { ...this.currentUser, uid: uid };
            this.getCurrentUser(uid).subscribe({
              next: (res: any) => {
                this.router.navigate(['/']);
                this.isLoading$.next(false);

                this.currentUser = { ...this.currentUser, ...res };
                this.isAuthenticated$.next(true);
                console.log(this.currentUser);

              }
            });
            console.log("Valid session");
          }
          else {
            console.log("navigating");
            this.isAuthenticated$.next(false);
            console.log("Session expired");
            this.router.navigate(['/login']);
            this.isLoading$.next(false);

          }
          this.isAuthenticated$.next(true);
        },
        error: (err) => {
          this.isAuthenticated$.next(false);
          this.router.navigate(['/login']);
          console.log("Session Expired");
          this.isLoading$.next(false);

        }
      });
    }
    else {
      this.isAuthenticated$.next(false);
      console.log("Invalid Session");
      this.isLoading$.next(false);

    }
  }

  getCurrentUser(uid: string) {
    return this.firebase.getUserData(uid);
  }

  getUserId() {
    return String(this.currentUser?.uid);
  }

  getEmployeeId() {
    return String(this.currentUser?.employeeId);
  }
}
