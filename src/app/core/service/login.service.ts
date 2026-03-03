import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<Object> {
    return this.httpClient.post('/api/register', user);
  }

  login(user: User): Observable<Object> {
    return this.httpClient.post('/api/login', user, {responseType: 'text'});
  }

  isAuthTokenCorrect(token: String): Observable<Object> {
    return this.httpClient.get('/api/auth/' + token);
  }
}
