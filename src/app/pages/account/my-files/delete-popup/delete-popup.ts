import { Component, EventEmitter, input, Output } from '@angular/core';
import { DownloadFile } from '../../../../core/model/DownloadFile';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.html',
  styleUrls: ['./delete-popup.scss']
})
export class DeletePopupComponent {
  file = input.required<DownloadFile | undefined>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  message() {
    return "Êtes-vous sûr de vouloir supprimer votre fichier " + this.file()?.name + "." + this.file()?.extension + " ?";
  }

  cancelDelete() {
	  this.cancel.emit();
  }

  confirmDelete() {
    this.confirm.emit();
  }
}