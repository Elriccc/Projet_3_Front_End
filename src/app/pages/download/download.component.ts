import { AfterViewInit, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../core/service/file.service';
import { ErrorUtil } from '../../core/util/error-util';
import { DownloadFile } from '../../core/model/DownloadFile';
import { saveAs } from 'file-saver';

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
    private route = inject(ActivatedRoute);
    private service = inject(FileService);
    private errorUtil = inject(ErrorUtil);
    downloadForm: FormGroup = new FormGroup({});
    submitted: boolean = false;
    loaded: WritableSignal<boolean> = signal(false);
    validated: WritableSignal<boolean> = signal(false);
    downloadError: WritableSignal<string> = signal('');
    
    fileName: WritableSignal<string> = signal('');
    fileSize: WritableSignal<string> = signal('');
    expirationMessage: WritableSignal<string> = signal('');
    daysUntilExpired: WritableSignal<number> = signal(0);
    usePassword: WritableSignal<boolean> = signal(false);
    fileLink: string;

    constructor() {
        this.downloadForm = this.formBuilder.group({
            password: ['', Validators.required],
        },);
        this.fileLink = this.route.snapshot.paramMap.get('fileLink') + '';
    }

    ngOnInit() {
        this.service.retrieveFileByLink(this.fileLink)
            .pipe(this.errorUtil.returnRetrieveFileByLinkError(this.router, this.daysUntilExpired, this.loaded))
            .subscribe((downloadFile: DownloadFile) => {
                this.fileName.set(downloadFile.name + '.' + downloadFile.extension);
                if (downloadFile.size < 1000) {
                    this.fileSize.set(downloadFile.size + " o");
                } else if (downloadFile.size < 1000 * 1000) {
                    this.fileSize.set((downloadFile.size / 1000).toFixed(2) + " Ko");
                } else if (downloadFile.size < 1000 * 1000 * 1000) {
                    this.fileSize.set((downloadFile.size / (1000 * 1000)).toFixed(2) + " Mo");
                } else {
                    this.fileSize.set((downloadFile.size / (1000 * 1000 * 1000)).toFixed(2) + " Go");
                }
                this.daysUntilExpired.set(downloadFile.daysUntilExpired);
                let expirationMessage = "Ce fichier expirera dans ";
                switch(downloadFile.daysUntilExpired){
                    case 1: expirationMessage += "un jour";break;
                    case 2: expirationMessage += "deux jours";break;
                    case 3: expirationMessage += "trois jours";break;
                    case 4: expirationMessage += "quatre jours";break;
                    case 5: expirationMessage += "cinq jours";break;
                    case 6: expirationMessage += "six jours";break;
                    case 7: expirationMessage += "une semaine";break;
                }
                expirationMessage+=".";
                this.expirationMessage.set(expirationMessage);
                this.usePassword.set(downloadFile.usePassword);
                if(this.usePassword() == false) {
                    this.downloadForm = this.formBuilder.group({});
                }
                this.loaded.set(true);
        });
    }

    get form() {
        return this.downloadForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.downloadForm.invalid){
            console.log("bruh")
            return;
        }

        var password = (this.usePassword())? this.downloadForm.get('password')?.value ?? '' : '';
        this.service.download(this.fileLink, password)
            .pipe(this.errorUtil.returnDownloadError(this.downloadError))
            .subscribe(fileContent => {
                this.downloadError.set('');
                saveAs(fileContent+'', this.fileName());
            })
    }
}