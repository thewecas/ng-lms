import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
}
