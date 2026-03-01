import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../user-service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    loginForm: FormGroup = new FormGroup({});
    submitted: boolean = false;
    userService = inject(UserService);

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: ['', Validators.required],
            password: ['', Validators.required]
        },);
    }

    get form() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.userService.connect();
        this.router.navigate(['/']);
    }
}
