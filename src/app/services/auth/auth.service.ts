import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, catchError } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new Subject<boolean>();
  private currentUser: User | null = null;
  expirationTime: number = 60 * 60 * 60 * 60;
  isLoading$ = new BehaviorSubject<boolean>(false);


  constructor(private router: Router, private firebase: FirebaseService, private snakbar: MatSnackBar) { }

  /**
   * Store the idtoken of user to local storage
   * @param idToken - access token of the current user
   */
  storeUserToLocalStorage(idToken: string) {
    localStorage.setItem('lms-userIdToken', idToken);
  }

  /**
   * @returns - idtokne from the local storage
   */
  fetchUserFromLocalStorage() {
    return localStorage.getItem('lms-userIdToken');
  }

  /**
   * Login user into the lms webapp
   * Call the siginin method of firebase authentication
   * store the idtoken to localstorage
   * Get the user information from the realtime database
   * Navigate user based on his role
   * @param useCredentials - contains email & password
   */
  login(useCredentials: { email: string, password: string; }) {
    this.isLoading$.next(true);

    this.firebase.signInUser(useCredentials)
      .subscribe({
        next: (res: any) => {
          const idToken = res.idToken;
          this.currentUser = { ...Object(this.currentUser), idToken: idToken };
          this.storeUserToLocalStorage(idToken);
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
          console.log(err);

          this.isLoading$.next(false);
          this.snakbar.open(this.formatError(err.error.error.message), 'OK');

        }
      });
  }



  /**
   * Logout the current user
   * remove the lms-useridToken from the localstorage
   * set current user to null
   * 
   */
  logout() {
    localStorage.removeItem('lms-userIdToken');
    this.router.navigate(['/login']);
    this.currentUser = null;
    this.isAuthenticated$.next(false);
  }

  checkIsAuthenticated() {
    /** If current user not null means user is logged in  */
    if (!!this.currentUser && this.currentUser.idToken) {
      /**Check session validity */
      this.checkSessionValidity(this.currentUser.idToken);
    }
    /**try to fetch the idToken from localStorage */
    else {
      const idToken = this.fetchUserFromLocalStorage();
      /**if id exist then check session validity */
      if (idToken)
        this.checkSessionValidity(idToken);
      else {
        /**not a valid session */
        return false;
      }
    }

  }

  checkSessionValidity(idToken: string) {
    return this.firebase
      .lookupUser(idToken);

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
            this.currentUser = { ...Object(this.currentUser), uid: uid, idToken: idToken };
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

  getIdToken(): string | null {
    return this.currentUser?.idToken ?? null;
  }




  formatError(err: string) {
    const op = err.split("_").map(str =>
      str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
    );
    return op.join(' ');

  }
}
