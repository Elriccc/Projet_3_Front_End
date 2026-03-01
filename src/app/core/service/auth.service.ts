import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  isAuthTokenCorrect(token: String): Observable<Object> {
    return this.httpClient.get('/api/auth/' + token);
  }

}
