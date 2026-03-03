import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  Connected = signal(false);
  
  connect() {
    this.Connected.set(true);
  }

  disconnect() {
    this.Connected.set(false);
  }
}