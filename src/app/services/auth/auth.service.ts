import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';
import { ToastService } from '../toast/toast.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  isAdmin$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  currentUser: User | null = null;
  readonly expirationTime: number = 60 * 60 * 60 * 60;
  readonly tokenName = 'lms-userToken';

  constructor(
    private readonly router: Router,
    private readonly firebase: FirebaseService,
    private readonly toast: ToastService
  ) {}

  /**
   * Login user into the lms webapp
   * Call the sign in method of firebase authentication,
   * store the refresh token to local storage,
   * Get the user information from the realtime database,
   * Navigate user based on his role
   * @param useCredentials - contains email & password
   */
  login(useCredentials: { email: string; password: string }) {
    this.isLoading$.next(true);

    this.firebase.signInUser(useCredentials).subscribe({
      next: (res: { uid: string; idToken: string; refreshToken: string }) => {
        this.storeUserToLocalStorage(res.refreshToken);
        this.currentUser = {
          ...Object(this.currentUser),
          ...res,
        };
        this.firebase.getUserData(res.uid).subscribe({
          next: (response: User) => {
            if (response.isDeleted) {
              /**user account is deleted */
              this.toast.show('Account is deleted', 'error', true);
              this.isAuthenticated$.next(false);
              this.isLoading$.next(false);
            } else {
              this.currentUser = {
                ...this.currentUser,
                ...response,
              };
              if (this.currentUser?.role === 'admin') this.isAdmin$.next(true);
              this.router.navigate(['/leaves']);
              this.isAuthenticated$.next(true);
              this.isLoading$.next(false);
              this.toast.show('Signed in', 'info');
            }
          },
        });
      },
      error: (err) => {
        this.toast.show(err?.error?.error?.message, 'error', true);
        this.isAuthenticated$.next(false);
        this.isLoading$.next(false);
      },
    });
  }

  /**
   * Logout the current user,
   * remove the lms-user idToken from the local storage,
   * set current user to null,
   * navigate to login page
   */
  logout() {
    localStorage.removeItem(this.tokenName);
    this.currentUser = null;
    this.isAuthenticated$.next(false);
    this.isAdmin$.next(false);
    this.router.navigate(['/login']);
    this.toast.show('Signed out', 'info');
  }

  /**
   * checks whether the user is authenticated or not
   * @returns observable
   */
  checkIsAuthenticated() {
    this.isLoading$.next(true);
    return new Observable<boolean>((observer) => {
      /**if isAuthenticated is true then user is logged in & session is valid */
      if (this.isAuthenticated$.value) {
        observer.next(true);
        observer.complete();
        this.isLoading$.next(false);
      } else {
        /**try to fetch the refreshToken from localStorage */
        const refreshToken = this.fetchUserFromLocalStorage();
        /**if id exist then check for session validity */
        if (refreshToken)
          this.firebase.refreshIdToken(refreshToken).subscribe({
            next: (res: { uid: string; idToken: string }) => {
              this.currentUser = {
                ...Object(this.currentUser),
                ...res,
              };
              this.firebase.getUserData(res.uid).subscribe({
                next: (response: User) => {
                  this.currentUser = {
                    ...this.currentUser,
                    ...Object(response),
                  };
                  if (this.currentUser?.role === 'admin')
                    this.isAdmin$.next(true);
                  observer.next(true);
                  observer.complete();
                  this.isAuthenticated$.next(true);
                  this.isLoading$.next(false);
                },
                error: () => {
                  observer.next(false);
                  observer.complete();
                  this.isAuthenticated$.next(false);
                  this.isLoading$.next(false);
                },
              });
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
    return this.firebase.lookupUser(idToken).pipe(
      catchError(() => {
        throw new Error('Validation error');
      })
    );
  }

  /**
   * Store the idToken of user to local storage
   * @param idToken - access token of the current user
   */
  storeUserToLocalStorage(token: string) {
    localStorage.setItem(this.tokenName, token);
  }

  /**
   * fetches the user idToken stored in the local storage of
   * @returns - idToken from the local storage
   */
  fetchUserFromLocalStorage() {
    return localStorage.getItem(this.tokenName);
  }

  /**
   * @returns - userId of current user
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
   * @returns -idToken of current user
   */
  getIdToken(): string | null {
    return this.currentUser?.idToken ?? null;
  }

  /**
   * @returns - role of current user
   */
  getUserRole() {
    return String(this.currentUser?.role);
  }

  getUserName() {
    return String(this.currentUser?.name);
  }
}
