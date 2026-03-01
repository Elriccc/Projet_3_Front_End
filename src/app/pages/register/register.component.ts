import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    standalone: true,
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    registerForm: FormGroup = new FormGroup({});
    submitted: boolean = false;

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            login: ['', Validators.required],
            password: ['', Validators.required],
            passwordConfirmation: ['', Validators.required]
        },);
    }

    get form() {
        return this.registerForm.controls;
    }

    onSubmit() {
        
        this.router.navigate(['/login']);
    }
}
