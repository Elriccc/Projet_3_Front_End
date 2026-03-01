import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { UserService } from './user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);
  userService = inject(UserService);
  protected readonly title = signal('datashare-frontend');
  
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
