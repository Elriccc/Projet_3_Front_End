import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadFile } from '../../../../core/model/DownloadFile';

@Component({
  selector: 'app-my-file',
  imports: [CommonModule],
  templateUrl: './my-file.component.html',
  styleUrl: './my-file.component.scss',
})
export class MyFileComponent {
    file = input.required<DownloadFile>();
}
