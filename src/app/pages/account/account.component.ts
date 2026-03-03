import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkWithHref],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements AfterViewInit {
  @ViewChild('myFiles', { static: false }) myFilesBtn!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit(): void {
    this.myFilesBtn.nativeElement.click();
  }
}
