import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  public currentUser: User | null = null;
  expirationTime: number = 60 * 60 * 60 * 60;
  isLoading$ = new BehaviorSubject<boolean>(false);


  checkIsAuthenticated() {
    return new Observable<boolean>(observer => {
      /**if isAuthenticated is true then user is logged in & session is valid */
      if (this.isAuthenticated$.value) {
        observer.next(true);
        observer.complete();

      }
      /**try to fetch the idToken from localStorage */
      else {
        const idToken = this.fetchUserFromLocalStorage();
        /**if id exist then check for session validity */
        if (idToken)
          this.checkSessionValidity(idToken).subscribe({
            next: res => {
              this.currentUser = { ...Object(this.currentUser), idToken: idToken };
              this.getCurrentUser(Object(res).users[0].localId).subscribe({
                next: res => {

                  console.log("fetching user data");

                  this.currentUser = { ...this.currentUser, ...Object(res) };
                  console.log("Current User ", this.currentUser);
                  observer.next(true);
                  observer.complete();
                  this.isAuthenticated$.next(true);
                }, error: err => {
                  this.isAuthenticated$.next(false);
                  observer.next(false);
                  observer.complete();
                }
              });

            },
            error: err => {
              console.log("next");
              observer.next(false);
              observer.complete();

            }
          });
        else {
          /**not a valid session */
          console.log("next");
          observer.next(false);
          observer.complete();

        }
      }
    });
  }

  checkSessionValidity(idToken: string) {
    return this.firebase
      .lookupUser(idToken).pipe(catchError(err => {
        this.notify(err);
        console.log("Validation erro ", err);
        throw "Validation error";
      }),
        tap(res => {
          console.log("Validation res ", res);
        })
      );
  }

  getCurrentUser(uid: string) {
    return this.firebase.getUserData(uid);
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
              this.router.navigate(['/leaves']);
              console.log(this.currentUser);
              this.isLoading$.next(false);
            }
          });
        },
        error: err => {
          this.isAuthenticated$.next(false);
          console.log(err);

          this.isLoading$.next(false);
          this.notify(err.error?.error?.message || ' ');

        }
      });
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

  getUserRole() {
    return this.currentUser?.role;
  }





  formatError(err: string) {
    const op = err.split("_").map(str =>
      str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase()
    );
    return op.join(' ');
  }

  notify(message: string) {
    this.snakbar.open(message, 'OK');
  }
}
