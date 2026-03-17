import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { UserService } from './user-service';
import { Router } from '@angular/router';
import { AuthUtil } from './core/util/auth-util';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  loaded: WritableSignal<boolean> = signal(false);
  userService = inject(UserService);
  authUtil = inject(AuthUtil);
  protected readonly title = signal('datashare-frontend');

  constructor() {
      this.authUtil.initAuth(this.loaded);
  }
  
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
