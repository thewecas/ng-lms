import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  public currentUser: User | null = null;
  expirationTime: number = 60 * 60 * 60 * 60;
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router, private firebase: FirebaseService, private toast: ToastService) { }

  /**
 * Login user into the lms webapp
 * Call the siginin method of firebase authentication,
 * store the idtoken to localstorage,
 * Get the user information from the realtime database,
 * Navigate user based on his role
 * @param useCredentials - contains email & password
 */
  login(useCredentials: { email: string, password: string; }) {
    this.isLoading$.next(true);

    this.firebase.signInUser(useCredentials)
      .subscribe({
        next: (res: any) => {
          const idToken = res.idToken;
          const uid = res.localId;
          this.storeUserToLocalStorage(idToken);
          this.currentUser = { ...Object(this.currentUser), idToken: idToken };
          this.getCurrentUser(uid).subscribe({
            next: (res: any) => {
              this.currentUser = { ...this.currentUser, ...res, uid: uid };
              if (this.currentUser?.role == 'admin')
                this.isAdmin$.next(true);
              this.router.navigate(['/leaves']);
              this.isAuthenticated$.next(true);
              this.isLoading$.next(false);
              this.toast.show('Logged in', 'info');
            }
          });
        },
        error: err => {
          this.toast.show(err?.error?.error?.message, 'error', true);
          this.isAuthenticated$.next(false);
          this.isLoading$.next(false);
        }
      });
  }

  /**
 * Logout the current user,
 * remove the lms-useridToken from the localstorage,
 * set current user to null,
 * navigate to login page
 */
  logout() {
    localStorage.removeItem('lms-userIdToken');
    this.router.navigate(['/login']);
    this.currentUser = null;
    this.isAuthenticated$.next(false);
    this.isAdmin$.next(false);
    this.toast.show('Logged out', 'info');

  }

  /**
   * checks whether the user is authenticated or not 
   * @returns observable
   */
  checkIsAuthenticated() {
    this.isLoading$.next(true);
    return new Observable<boolean>(observer => {
      /**if isAuthenticated is true then user is logged in & session is valid */
      if (this.isAuthenticated$.value) {
        observer.next(true);
        observer.complete();
        this.isLoading$.next(false);

      }
      else {
        /**try to fetch the idToken from localStorage */
        const idToken = this.fetchUserFromLocalStorage();
        /**if id exist then check for session validity */
        if (idToken)
          this.checkSessionValidity(idToken).subscribe({
            next: res => {
              this.currentUser = { ...Object(this.currentUser), idToken: idToken };
              const uid = Object(res).users[0].localId;
              this.getCurrentUser(uid).subscribe({
                next: res => {
                  this.currentUser = { ...this.currentUser, ...Object(res), uid: uid };
                  if (this.currentUser?.role == 'admin')
                    this.isAdmin$.next(true);
                  observer.next(true);
                  observer.complete();
                  this.isAuthenticated$.next(true);
                  this.isLoading$.next(false);

                }, error: err => {
                  this.isAuthenticated$.next(false);
                  observer.next(false);
                  observer.complete();
                  this.isLoading$.next(false);
                },
              });

            },
            error: err => {
              observer.next(false);
              observer.complete();
              this.isLoading$.next(false);
            },
          });
        else {
          /**not a valid session */
          observer.next(false);
          observer.complete();
          this.isLoading$.next(false);
        }
      }
    });
  }


  /**
   * Checks for session validity
   * @param idToken - accessToken or idToken of user
   * @returns - observable
   */
  checkSessionValidity(idToken: string) {
    return this.firebase
      .lookupUser(idToken).pipe(catchError(err => {
        throw "Validation error";
      }),
      );
  }

  /**
   * Funciton to fetch the userdetails frm realtime database 
   * @param uid - localId of the user
   * @returns - observable
   */
  getCurrentUser(uid: string) {
    return this.firebase.getUserData(uid);
  }

  /**
 * Store the idtoken of user to local storage
 * @param idToken - access token of the current user
 */
  storeUserToLocalStorage(idToken: string) {
    localStorage.setItem('lms-userIdToken', idToken);
  }

  /**
   * fetches the user idToken stored in the localstorage of 
   * @returns - idtokne from the local storage
   */
  fetchUserFromLocalStorage() {
    return localStorage.getItem('lms-userIdToken');
  }


  /**
   * @returns - userId of cuurent user
   */
  getUserId() {
    return String(this.currentUser?.uid);
  }

  /**
   * @returns - employeeId of current user
   */
  getEmployeeId() {
    return String(this.currentUser?.employeeId);
  }

  /**
   * @returns -idtoken of current user
   */
  getIdToken(): string | null {
    return this.currentUser?.idToken ?? null;
  }

  /**
   * @returns - role of current user 
   */
  getUserRole() {
    return this.currentUser?.role;
  }
}
