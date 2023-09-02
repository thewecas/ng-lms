import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Holiday } from 'src/app/models/holiday';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private dbUrl = environment.firebase.databaseURL;
  private apiKey = environment.firebase.apiKey;

  constructor(private http: HttpClient) { }

  fethcAllUsers() {
    return this.http.get(`${this.dbUrl}/users.json`);
  }

  signInUser(userCredentilas: { email: string, password: string; }) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, {
      ...userCredentilas,
      returnSecureToken: true
    });
  }

  signUpUser(userCredentilas: { email: string, password: string; }) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`, {
      ...userCredentilas,
      returnSecureToken: true
    });
  }


  updateUser(id: string, user: User) {
    return this.http.put(`${this.dbUrl}/users/${id}.json`, user);
  }

  setUserDeleted(id: string) {
    return this.http.patch(`${this.dbUrl}/users/${id}.json`, {
      isDeleted: true
    });
  }

  lookupUser(idToken: string) {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${this.apiKey}`, {
      idToken
    });
  }


  addHoliday(holiday: Holiday) {
    return this.http.post(`${this.dbUrl}/holidays.json`, {
      ...holiday
    });
  }

  fetchAllHolidays() {
    return this.http.get(`${this.dbUrl}/holidays.json`);
  }

  deleteHoliday(id: string) {
    return this.http.delete(`${this.dbUrl}/holidays/${id}.json`);
  }

  updateHoliday(id: string, holiday: Holiday) {
    return this.http.patch(`${this.dbUrl}/holidays/${id}.json`, {
      ...holiday
    });
  }
}
