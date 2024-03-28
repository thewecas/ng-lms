import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Holiday } from 'src/app/models/holiday';
import { Leave } from 'src/app/models/leave';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private readonly dbUrl = environment.firebase.databaseURL;
  private readonly apiKey = environment.firebase.apiKey;

  constructor(private readonly http: HttpClient) {}

  /**Authentication Related Methods */
  /**
   * Sing in user
   * @param userCredentials - Contains email and passowrd
   */
  signInUser(userCredentials: { email: string; password: string }) {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          ...userCredentials,
          returnSecureToken: true,
        }
      )
      .pipe(
        map((response) => {
          const res = Object(response);
          return {
            uid: res.localId,
            idToken: res.idToken,
            refreshToken: res.refreshToken,
          };
        })
      );
  }

  /**
   * Sing up user to the firebase authentication
   * @param userCredentials -contains email and password
   */
  signUpUser(userCredentials: { email: string; password: string }) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
      {
        ...userCredentials,
        returnSecureToken: true,
      }
    );
  }

  /**
   * Fetch user data from firebase Authentication service
   * @param idToken - id token of user
   * @returns - User info stored in the authentication service database
   */
  lookupUser(idToken: string) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`,
      {
        idToken,
      }
    );
  }

  /**
   * Exchange refreshToken for idtoken of current user
   * @param refreshToken - user's refersh token
   * @returns- object containing idtoken
   */
  refreshIdToken(refreshToken: string) {
    return this.http
      .post(`https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      })
      .pipe(
        map((res) => {
          return {
            uid: Object(res).user_id,
            idToken: Object(res).id_token,
          };
        })
      );
  }

  sendResetPasswordEmail(email: string) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.apiKey}`, {
      requestType: 'PASSWORD_RESET',
      email: email
    });
  }

  /** User Related Methods */
  /**
   * Fetch all the user data from database
   */
  fetchAllUsers() {
    return this.http.get(
      `${this.dbUrl}/users.json?orderBy="isDeleted"&equalTo=false`
    );
  }

  /**
   * Set isDeleted flag of user to true
   * @param id - user's unique id
   * @returns
   */
  setUserDeleted(id: string) {
    return this.http.patch(`${this.dbUrl}/users/${id}.json`, {
      isDeleted: true,
    });
  }

  /**
   * Update user data
   * @param id - unique id of the user
   * @param user - updated user data
   */
  updateUser(id: string, user: User) {
    return this.http.put(`${this.dbUrl}/users/${id}.json`, user);
  }

  /**
   *Fetch user data using user id
   * @param uid - unique id of the user
   * @returns - User data
   */
  getUserData(uid: string) {
    return this.http.get(`${this.dbUrl}/users/${uid}.json`).pipe(
      map((res) => {
        return Object(res);
      })
    );
  }

  /**
   * Fetch user data using employeeId
   * @param employeeId - users emploayeeId
   * @returns - User data
   */
  getUserByEmployeeId(employeeId: string) {
    return this.http.get(
      `${this.dbUrl}/users.json?orderBy="employeeId"&equalTo="${employeeId}"`
    );
  }
  /**
   * Fetch user data using email id
   * @param email - users email id
   * @returns - User data
   */
  getUserByEmail(email: string) {
    return this.http.get(
      `${this.dbUrl}/users.json?orderBy="email"&equalTo="${email}"`
    );
  }

  /** Holiday Related Methods */

  /**
   * Fetch All holiday Data
   * @returns - Holiday data
   */
  fetchAllHolidays() {
    return this.http.get<Holiday[]>(`${this.dbUrl}/holidays.json`);
  }

  /**
   *Add new Holiday to the database
   * @param holiday - Contains holdiay details
   * @returns - Holiay object
   */
  addHoliday(holiday: Holiday) {
    return this.http.post(`${this.dbUrl}/holidays.json`, {
      ...holiday,
    });
  }

  /**
   * Delete a holiday
   * @param id - holiday id
   */
  deleteHoliday(id: string) {
    return this.http.delete(`${this.dbUrl}/holidays/${id}.json`);
  }

  /**
   * Update holiday data
   * @param id - unique id of holiday object
   * @param holiday - updated holiday object
   */
  updateHoliday(id: string, holiday: Holiday) {
    return this.http.patch(`${this.dbUrl}/holidays/${id}.json`, {
      ...holiday,
    });
  }

  /* Leaves Related Methods */

  /**
   * Fetch All leaves Data from database
   */
  fetchAllLeaves() {
    return this.http.get(`${this.dbUrl}/leaves.json`);
  }

  /**
   * Fetch all leaves data of a user bu his userid
   * @param uid - unique id of the user
   */
  fetchLeavesByUser(uid: string) {
    return this.http.get(`${this.dbUrl}/leaves/${uid}.json`);
  }

  /**
   * Add new Leave data to the database
   * @param uid - user's unique id
   * @param leave - Leave object
   */
  addLeave(uid: string, leave: Leave) {
    return this.http.post(`${(this, this.dbUrl)}/leaves/${uid}.json`, {
      ...leave,
    });
  }

  /**
   * Edit leave data
   * @param uid - unique id of the user
   * @param leaveId - unique id of the leave
   * @param leave - Leave object
   */
  editLeave(uid: string, leaveId: string, leave: Leave) {
    return this.http.patch(`${this.dbUrl}/leaves/${uid}/${leaveId}.json`, {
      ...leave,
    });
  }
  /**
   * Update the leave status
   * @param uid - unique id of the user
   * @param leaveId - unique id of the leave
   * @param status - 'Approved' | 'Rejected'
   */
  updateStatus(uid: string, leaveId: string, status: string) {
    return this.http.patch(`${this.dbUrl}/leaves/${uid}/${leaveId}.json`, {
      status,
    });
  }

  /**
   * Delete leave
   * @param uid - unique id of the user
   * @param leaveId - unique id of the leave
   */
  deleteLeave(uid: string, leaveId: string) {
    return this.http.delete(`${this.dbUrl}/leaves/${uid}/${leaveId}.json`);
  }
}
