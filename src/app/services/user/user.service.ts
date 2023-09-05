import { Injectable } from '@angular/core';
import { BehaviorSubject, exhaustMap, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: {} = [];
  private users$ = new BehaviorSubject<any>(this.users);
  isUpdated$ = new BehaviorSubject<boolean>(true);
  constructor(private firebase: FirebaseService) {

  }

  getUserData() {
    if (!this.users)
      this.gethAllUsers();
    return this.users$.asObservable();
  }

  gethAllUsers() {
    return this.firebase.fethcAllUsers().subscribe(res => {
      this.users = res;
      const userData = Object.entries(res).map(([key, val]) => {
        return { ...val, uid: key };
      }).filter(user => !user.isDeleted);
      this.users$.next(userData);
    });

    /*  Object.values(res).filter(user => !user.isDeleted).
       this.users$.next(); */

  }

  addNewUser(user: any) {
    return this.firebase
      .signUpUser({ email: user.email, password: user.password })
      .pipe(
        tap((res: any) => console.log(res)),
        exhaustMap(res => {
          return this.updateUser(res.localId, user);
        }));
  }

  deleteUser(id: string) {
    console.log("deleting : ", id);

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

}
