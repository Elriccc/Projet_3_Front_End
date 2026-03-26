import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  baseUrlApi: string = 'http://localhost:8081/api/';
  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseUrlApi}register`, user);
  }

  login(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseUrlApi}login`, user, {responseType: 'text'});
  }

  isAuthTokenCorrect(token: String): Observable<Object> {
    return this.httpClient.get(`${this.baseUrlApi}auth/${token}`);
  }
}
