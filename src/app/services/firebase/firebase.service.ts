import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Holiday } from 'src/app/models/holiday';
import { Leave } from 'src/app/models/leave';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private dbUrl = environment.firebase.databaseURL;
  private apiKey = environment.firebase.apiKey;

  constructor(private http: HttpClient, private snakbar: MatSnackBar) {}

  signInUser(userCredentilas: { email: string; password: string }) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
      {
        ...userCredentilas,
        returnSecureToken: true,
      }
    );
  }

  signUpUser(userCredentilas: { email: string; password: string }) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
      {
        ...userCredentilas,
        returnSecureToken: true,
      }
    );
  }

  lookupUser(idToken: string) {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`,
      {
        idToken,
      }
    );
  }

  refershIdToken(refreshToken: string) {
    return this.http.post(
      `https://securetoken.googleapis.com/v1/token?key=${this.apiKey}`,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    );
  }

  fethcAllUsers() {
    return this.http.get(
      `${this.dbUrl}/users.json?orderBy="isDeleted"&equalTo=false`
    );
  }

  setUserDeleted(id: string) {
    return this.http.patch(`${this.dbUrl}/users/${id}.json`, {
      isDeleted: true,
    });
  }

  updateUser(id: string, user: User) {
    return this.http.put(`${this.dbUrl}/users/${id}.json`, user);
  }

  getUserData(uid: string) {
    return this.http.get(`${this.dbUrl}/users/${uid}.json`);
  }

  getUserByEmployeeId(employeeId: string) {
    return this.http.get(
      `${this.dbUrl}/users.json?orderBy="employeeId"&equalTo="${employeeId}"`
    );
  }

  getUserByEmail(email: string) {
    return this.http.get(
      `${this.dbUrl}/users.json?orderBy="email"&equalTo="${email}"`
    );
  }

  addHoliday(holiday: Holiday) {
    return this.http.post(`${this.dbUrl}/holidays.json`, {
      ...holiday,
    });
  }

  fetchAllHolidays() {
    return this.http.get<Holiday[]>(`${this.dbUrl}/holidays.json`);
  }

  deleteHoliday(id: string) {
    return this.http.delete(`${this.dbUrl}/holidays/${id}.json`);
  }

  updateHoliday(id: string, holiday: Holiday) {
    return this.http.patch(`${this.dbUrl}/holidays/${id}.json`, {
      ...holiday,
    });
  }

  fetchAllLeaves() {
    return this.http.get(`${this.dbUrl}/leaves.json`);
  }

  fetchLeavesByUser(uid: string) {
    return this.http.get(`${this.dbUrl}/leaves/${uid}.json`);
  }

  addLeave(uid: string, leave: Leave) {
    return this.http.post(`${(this, this.dbUrl)}/leaves/${uid}.json`, {
      ...leave,
    });
  }

  editLeave(uid: string, leaveId: string, leave: Leave) {
    return this.http.patch(`${this.dbUrl}/leaves/${uid}/${leaveId}.json`, {
      ...leave,
    });
  }

  updateStatus(uid: string, leaveId: string, status: string) {
    return this.http.patch(`${this.dbUrl}/leaves/${uid}/${leaveId}.json`, {
      status: status,
    });
  }

  deleteLeave(uid: string, leaveId: string) {
    return this.http.delete(`${this.dbUrl}/leaves/${uid}/${leaveId}.json`);
  }
}
