import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, UserCredential, getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { DataSnapshot, child, get, getDatabase, ref } from '@angular/fire/database';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any = null;
  isLoading$ = new BehaviorSubject<boolean>(true);
  errorMessage$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private router: Router, private auth: Auth) {
    this.auth = getAuth();
  }


  /**
   * signin with email & password by calling auth_login()
   * store the response in the currentUser object
   * get the user details by calling getCurrentUser()
   * then redirect user with navigateUser();
   * @param user - user object containing email and password
  
   */
  onLogin(user: { email: string, password: string; }) {
    this.isLoading$.next(true);
    this.auth_login(user.email, user.password)
      .then((userCredentials: UserCredential) => {
        this.currentUser = userCredentials.user;
        this.getCurrentUser()
          .then(res => {
            this.navigateUser();
            this.isLoading$.next(false);
          });
      })
      .catch((error) => {
        this.errorMessage$.next(error.code);
        this.isLoading$.next(false);
      });
  }

  onSignOut() {
    this.isLoading$.next(true);
    this.signOut()
      .then(res => {
        console.log("Signed out");
        this.router.navigate(['/auth']);

      }).finally(() => {
        this.isLoading$.next(false);
      });
  }

  /**
   * calls the getUserFromFirebase()
   * if it resolves then the user info is merged with currentUser object
   */
  async getCurrentUser() {
    await this.auth_getUserFromFirebase()
      .then((snapshot: DataSnapshot) => {
        if (snapshot.exists()) {
          const userInfo = snapshot.val();
          this.currentUser = { ...this.currentUser, ...userInfo };
        }
      })
      .catch(error => {
        this.errorMessage$.next(error.code);
      }
      );
  }

  /**
   * checks for valid session
   * if the onAuthStateChanged returns a valid user, then it fetches the data from realtime database by calling getCurrentUser()
   * otherwise redirects the user to login page
   */
  isValidSession() {
    this.auth.onAuthStateChanged(user => {
      if (!!user) {
        this.currentUser = user;
        this.getCurrentUser()
          .then(res => {
            this.navigateUser();
            this.isLoading$.next(false);
          });
      }
      else {
        this.router.navigate(['/auth']);
        this.isLoading$.next(false);
      }

    });
  }


  /**
   * redirects the user based on their role
   */
  navigateUser() {
    if (this.currentUser.role == 'admin')
      this.router.navigate(['/admin']);
    else
      this.router.navigate(['/employee']);
  }

  /**
   * Asynchronously signs in using an email and password. 
   * @param email - users email
   * @param password - users password
   * @returns - returns promise of type UserCredential
   */
  private auth_login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  /**
   * Asynchronously fetches the user data from realtime database using the users's uid
   * @returns - promise of type DataSnapshot
   */
  private auth_getUserFromFirebase() {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `users/${this.currentUser?.uid}`));
  }

  private signOut() {
    this.currentUser = null;
    return this.auth.signOut();
  }

}
