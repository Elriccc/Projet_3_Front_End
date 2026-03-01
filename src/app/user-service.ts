import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isConnected = false;
  Connected = signal(this.isConnected);

  connect() {
    this.Connected.set(true);
  }

  disconnect() {
    this.Connected.set(false);
  }
}