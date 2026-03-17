import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFile } from '../../../../core/model/DownloadFile';
import { Router } from '@angular/router';

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
      let message = "Expire ";
      if(this.file().daysUntilExpired <= 0) {
        return "Expiré";
      } else if(this.file().daysUntilExpired == 1) {
        return message + "demain";
      } else {
        message += "dans "
        switch(this.file().daysUntilExpired){
          case 2: return message + "deux jours";
          case 3: return message + "trois jours";
          case 4: return message + "quatre jours";
          case 5: return message + "cinq jours";
          case 6: return message + "six jours";
          case 7: return message + "une semaine";
          default: return ""
        }
      }
    }

    deleteFileEvent() {
      this.deleteFileFromArray.emit(this.file());
    }

    gotoFile() {
      this.router.navigate(['/' + this.file().fileLink]);
    }
}
