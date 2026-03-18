import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFile } from '../../../../core/model/DownloadFile';
import { Router } from '@angular/router';
import { buildExpirationMessage } from '../../../../core/util/file-util';

@Component({
  selector: 'app-my-file',
  imports: [CommonModule],
  templateUrl: './my-file.component.html',
  styleUrl: './my-file.component.scss',
})
export class MyFileComponent {
    private router = inject(Router);
    file = input.required<DownloadFile>();
    @Output() deleteFileFromArray = new EventEmitter();

    filename(){
      return this.file().name + "." + this.file().extension;
    }

    expiration(){
      if(this.file().daysUntilExpired <= 0) {
        return "Expiré";
      } else if(this.file().daysUntilExpired == 1) {
        return "Expire demain";
      } else {
        return buildExpirationMessage(this.file().daysUntilExpired, "Expire dans ")
      }
    }

    deleteFileEvent() {
      this.deleteFileFromArray.emit(this.file());
    }

    gotoFile() {
      this.router.navigate(['/' + this.file().fileLink]);
    }
}
