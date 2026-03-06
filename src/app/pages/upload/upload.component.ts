import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {Clipboard} from '@angular/cdk/clipboard';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-upload',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './upload.component.html',
    standalone: true,
    styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private clipboard = inject(Clipboard);
    uploadForm: FormGroup = new FormGroup({});
    submitted: boolean = false;
    validated: boolean = false;
    fileName: WritableSignal<string> = signal('Aucun fichier sélectionné');
    fileSize: WritableSignal<string> = signal('');
    fileExpiration: WritableSignal<string> = signal('');
    fileLink: WritableSignal<string> = signal('');


    ngOnInit() {
        this.uploadForm = this.formBuilder.group({
            file: ['', Validators.required],
            password: ['', Validators.required],
            expiration: ['', Validators.required]
        },);
    }

    get form() {
        return this.uploadForm.controls;
    }

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if(target?.files?.length) {
            this.fileName.set(target.files[0].name);
            this.fileSize.set((target.files[0].size / 1000000).toFixed(2) + ' Mo');
        }
    }

    onSubmit() {
        this.fileLink.set(window.location.origin);
        
        this.fileExpiration.set("Félicitations, ton fichier sera conservé chez nous pendant " + " !")
        this.validated = true;
    }

    copyLink() {
        this.clipboard.copy(this.fileLink())
    }
}