import { Component, inject, OnInit } from '@angular/core';
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

    ngOnInit() {
        this.downloadForm = this.formBuilder.group({
            file: ['', Validators.required],
            expiration: ['', Validators.required],
            password: ['', Validators.required],
        },);
    }

    get form() {
        return this.downloadForm.controls;
    }

    onSubmit() {
        
    }
}