import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-download',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './download.component.html',
    standalone: true,
    styleUrl: './download.component.scss'
})
export class DownloadComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    downloadForm: FormGroup = new FormGroup({});
    submitted: boolean = false;
    fileName: WritableSignal<string> = signal('Aucun fichier sélectionné');
    fileSize: WritableSignal<string> = signal('');
    fileExpirationMessage: WritableSignal<string> = signal('');
    fileDaysUntilExpired: WritableSignal<number> = signal(0);

    ngOnInit() {
        this.downloadForm = this.formBuilder.group({
            password: ['', Validators.required],
        },);

        this.fileExpirationMessage.set("Ce fichier expirera dans 3 jours.");
    }

    get form() {
        return this.downloadForm.controls;
    }

    onSubmit() {
        
    }
}