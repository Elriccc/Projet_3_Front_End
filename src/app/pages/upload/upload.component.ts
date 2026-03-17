import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { passwordExistAndIsTooShort } from '../../core/util/validator-util';
import { FileService } from '../../core/service/file.service';
import { UploadFile } from '../../core/model/UploadFile';
import { DownloadFile } from '../../core/model/DownloadFile';
import { ErrorUtil } from '../../core/util/error-util';
import { Observer } from 'rxjs';

@Component({
    selector: 'app-upload',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './upload.component.html',
    standalone: true,
    styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private clipboard = inject(Clipboard);
    private service = inject(FileService);
    private errorUtil = inject(ErrorUtil);
    private uploadFile: UploadFile = {
        password: '',
        expirationTime: 0,
        file: new File([], '')
    }
    uploadForm: FormGroup = new FormGroup({});
    fileName: WritableSignal<string> = signal('Aucun fichier sélectionné');
    fileSizeStr: WritableSignal<string> = signal('');

    submitted: boolean = false;
    validated: WritableSignal<boolean> = signal(false);
    fileNameError: WritableSignal<string> = signal('');
    fileSizeError: WritableSignal<string> = signal('');
    uploadError: WritableSignal<string> = signal('');

    fileExpiration: WritableSignal<string> = signal('');
    fileLink: WritableSignal<string> = signal('');


    ngOnInit() {
        this.uploadForm = this.formBuilder.group({
            password: ['', passwordExistAndIsTooShort()],
            expiration: ['7', Validators.required],
            file: ['', Validators.required]
        },);
    }

    get form() {
        return this.uploadForm.controls;
    }

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        this.fileNameError.set('');
        this.fileSizeError.set('');
        if (!target?.files?.length) {
            this.fileName.set('Aucun fichier sélectionné');
            this.fileSizeStr.set('');
            return;
        }
        if (target.files[0].name.length > 255) {
            this.fileNameError.set('Le nom du fichier est trop long');
        }

        this.fileName.set(target.files[0].name);
        const size = target.files[0].size;
        if (size < 1000) {
            this.fileSizeError.set('Le fichier doit faire au moins 1Ko');
            this.fileSizeStr.set(size + " o");
        } else if (size < 1000 * 1000) {
            this.fileSizeStr.set((size / 1000).toFixed(2) + " Ko");
        } else if (size < 1000 * 1000 * 1000) {
            this.fileSizeStr.set((size / (1000 * 1000)).toFixed(2) + " Mo");
        } else {
            this.fileSizeStr.set((size / (1000 * 1000 * 1000)).toFixed(2) + " Go");
            if (size > 1000 * 1000 * 1000) {
                this.fileSizeError.set("Le fichier ne peut pas faire plus d'1Go");
            }
        }
        this.uploadFile.file = target.files[0];
    }

    onSubmit() {
        this.submitted = true;
        if (this.uploadForm.invalid || this.fileNameError().length > 0 || this.fileSizeError().length > 0) {
            return;
        }

        this.uploadFile.password = this.uploadForm.get('password')?.value ?? '';
        this.uploadFile.expirationTime = Number(this.uploadForm.get('expiration')?.value ?? 0);
        this.service.upload(this.uploadFile)
            .pipe(this.errorUtil.returnUploadError(this.uploadError))
            .subscribe((downloadFile: DownloadFile) => {
                this.fileLink.set(window.location.origin + '/' + downloadFile.fileLink);
                let expirationMessage = "Félicitations, ton fichier sera conservé chez nous pendant ";
                switch(downloadFile.daysUntilExpired){
                    case 1: expirationMessage += "un jour";break;
                    case 2: expirationMessage += "deux jours";break;
                    case 3: expirationMessage += "trois jours";break;
                    case 4: expirationMessage += "quatre jours";break;
                    case 5: expirationMessage += "cinq jours";break;
                    case 6: expirationMessage += "six jours";break;
                    case 7: expirationMessage += "une semaine";break;
                }
                expirationMessage += " !";
                this.fileExpiration.set(expirationMessage);
                this.validated.set(true);
            })
    }

    copyLink() {
        this.clipboard.copy(this.fileLink())
    }
}