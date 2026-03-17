import { ChangeDetectorRef, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthUtil } from '../../../core/util/auth-util';
import { FileService } from '../../../core/service/file.service';
import { DownloadFile } from '../../../core/model/DownloadFile';
import { MyFileComponent } from './my-file/my-file.component';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';

@Component({
  selector: 'app-my-files',
  imports: [CommonModule, RouterLink, MyFileComponent, DeletePopupComponent],
  templateUrl: './my-files.component.html',
  styleUrl: './my-files.component.scss',
})
export class MyFilesComponent {
  private router = inject(Router);
  private authUtil = inject(AuthUtil);
  private fileService = inject(FileService);
  private ref = inject(ChangeDetectorRef);
  cachedFiles: DownloadFile[] = [];
  files: WritableSignal<DownloadFile[]> = signal([]);
  filesLoaded: WritableSignal<boolean> = signal(false);
  selectedFile: DownloadFile | undefined;
  isPopupVisible: WritableSignal<boolean> = signal(false);

  constructor() {
    this.fileService.retrieveAllFiles().subscribe((files: DownloadFile[]) => {
      this.cachedFiles = files.sort((a, b) => {
        if (a.daysUntilExpired <= 0 && b.daysUntilExpired > 0) {
          return 1;
        } else if (a.daysUntilExpired > 0 && b.daysUntilExpired <= 0) {
          return -1;
        }
        return a.daysUntilExpired - b.daysUntilExpired;
      });
      this.files.set(this.cachedFiles);
      this.filesLoaded.set(true);
    })
  }

  allFiles() {
    this.files.set(this.cachedFiles);
  }

  activeFiles() {
    this.files.set(this.cachedFiles.filter((file) => file.daysUntilExpired > 0));
  }

  expiredFiles() {
    this.files.set(this.cachedFiles.filter((file) => file.daysUntilExpired <= 0));
  }

  showPopup(file: DownloadFile) {
    this.selectedFile = file;
    this.isPopupVisible.set(true);
  }

  cancelDelete() {
    this.selectedFile = undefined;
    this.isPopupVisible.set(false);
  }

  deleteFile() {
    this.isPopupVisible.set(false);
    if(!this.selectedFile) return;
    this.fileService.delete(this.selectedFile.fileLink + '').subscribe(() => {
      let files: DownloadFile[] = this.files().filter((filterFile) => filterFile.fileLink != this.selectedFile?.fileLink);
      this.files.set(files);
      this.cachedFiles = this.cachedFiles.filter((filterFile) => filterFile.fileLink != this.selectedFile?.fileLink);
      this.selectedFile = undefined;
      this.ref.detectChanges();
    });
  }

  disconnect() {
    this.authUtil.disconnect();
    this.router.navigate(['/']);
  }
}
