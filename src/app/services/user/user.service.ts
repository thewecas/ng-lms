import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, exhaustMap, skipWhile, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: any = null;
  private users$ = new BehaviorSubject<any>([]);
  isUpdated$ = new Subject<boolean>();
  constructor(private firebase: FirebaseService) {

  }

  getUserData() {
    if (!this.users)
      this.getAllUsers();
    return this.users$
      .asObservable()
      .pipe(skipWhile(res => res.length == 0));
  }

  getAllUsers() {
    this.firebase.fethcAllUsers().subscribe((res) => {
      this.users = res;
      const userData = Object.entries(res).map(([key, val]) => {
        return { ...Object(val), uid: key };
      });
      this.users$.next(userData);
    });

  }

  addNewUser(user: any) {
    return this.firebase
      .signUpUser({ email: user.email, password: user.password })
      .pipe(
        exhaustMap((res: any) => {
          return this.updateUser(res.localId, user);
        }));
  }

  deleteUser(id: string) {
    return this.firebase.setUserDeleted(id);
  }

  updateUser(uid: string, user: User) {
    return this.firebase.updateUser(
      uid, {
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      designation: user.designation,
      role: user.role,
      isDeleted: false
    });
  }


  checkEmployeeIdTaken(employeeId: string) {
    return this.firebase.getUserByEmployeeId(employeeId);
  }

  checkEmailTaken(email: string) {
    return this.firebase.getUserByEmail(email);
  }

  handleError(err: HttpErrorResponse) {

    return throwError(() => "");
  }

}
