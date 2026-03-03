import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthUtil } from '../../../core/util/auth-util';

@Component({
  selector: 'app-my-files',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.scss',
})
export class MyFilesComponent {
  private router = inject(Router);
  private authUtil = inject(AuthUtil);

    disconnect() {
        this.authUtil.disconnect();
        this.router.navigate(['/']);
    }
}
