import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { exhaustMap } from 'rxjs/internal/operators/exhaustMap';
import { skipWhile } from 'rxjs/internal/operators/skipWhile';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users!: User[];
  private readonly users$ = new BehaviorSubject<User[] | null>(null);

  constructor(private readonly firebase: FirebaseService) {}

  /**
   * Get User Data
   * @returns - Observable of user data
   */
  getUserData() {
    if (!this.users) this.getAllUsers();
    return this.users$.asObservable().pipe(skipWhile((res) => res === null));
  }

  /**
   * Fetches the user data from firebase.
   * Performs transformation to convert object of object to array of object
   */
  getAllUsers() {
    this.firebase.fetchAllUsers().subscribe((res) => {
      const userData = Object.entries(res).map(([key, val]) => {
        return { ...Object(val), uid: key };
      });
      this.users = userData;
      this.users$.next(userData);
    });
  }

  /**
   * Register New user
   * @param credentials - Contains email and password
   * @param user - Contains User info
   * @returns - observabel of signup user method
   */
  addNewUser(
    credentials: { email: string; password: string },
    user: {
      employeeId: string;
      name: string;
      email: string;
      role: string;
      designation: string;
      isDeleted: boolean;
    }
  ) {
    return this.firebase.signUpUser(credentials).pipe(
      exhaustMap((res) =>
        this.updateUser(Object(res).localId, {
          ...user,
          uid: Object(res).localId,
        })
      )
    );
  }

  /**
   * Delete the user by setting the flag isDeleted to true
   * @param id - user id
   */
  deleteUser(id: string) {
    return this.firebase.setUserDeleted(id);
  }

  /**
   * Update User Data
   * @param uid - unique id of user
   * @param user - user details
   */
  updateUser(uid: string, user: User) {
    return this.firebase.updateUser(uid, user);
  }

  /**
   * Chcek whether the employee Id is already associated with another user
   * @param employeeId - employeeId to be searched
   */
  checkEmployeeIdTaken(employeeId: string) {
    return this.firebase.getUserByEmployeeId(employeeId);
  }

  /**
   * Check whether the email id is already associated with another user
   * @param email - emal to be searched
   */
  checkEmailTaken(email: string) {
    return this.firebase.getUserByEmail(email);
  }

  sendResetPasswordEmail(email: string) {
    return this.firebase.sendResetPasswordEmail(email);
  }
}
