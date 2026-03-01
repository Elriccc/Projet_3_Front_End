import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    uploadForm: FormGroup = new FormGroup({});
    submitted: boolean = false;

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

    onSubmit() {
        
    }
}