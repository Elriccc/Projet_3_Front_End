import { Component, EventEmitter, input, Output } from '@angular/core';
import { DownloadFile } from '../../../../core/model/DownloadFile';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
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