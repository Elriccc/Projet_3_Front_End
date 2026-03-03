import { Component, inject, signal } from '@angular/core';
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
  userService = inject(UserService);
  authUtil = inject(AuthUtil);
  protected readonly title = signal('datashare-frontend');

  constructor() {
      this.authUtil.initAuth();
  }
  
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
