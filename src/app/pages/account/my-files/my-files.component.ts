import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthUtil } from '../../../core/util/auth-util';
import { FileService } from '../../../core/service/file.service';
import { DownloadFile } from '../../../core/model/DownloadFile';
import { MyFileComponent } from './my-file/my-file.component';

@Component({
  selector: 'app-my-files',
  imports: [CommonModule, RouterLink, MyFileComponent],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.scss',
})
export class MyFilesComponent implements OnInit{
  private router = inject(Router);
  private authUtil = inject(AuthUtil);
  private fileService = inject(FileService);
  files: DownloadFile[] = [];

    ngOnInit() {
      this.fileService.retrieveAllFiles().subscribe(response => {
        this.files = response;
      })
    }

    disconnect() {
        this.authUtil.disconnect();
        this.router.navigate(['/']);
    }
}
