import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../core/service/login.service';
import { User } from '../../core/model/User';
import { ErrorUtil } from '../../core/util/error-util';

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
    private service = inject(LoginService)
    private errorUtil = inject(ErrorUtil)
    private user: User = {
        login: '',
        password: ''
    }
    submitted: boolean = false;
    registerForm: FormGroup = new FormGroup({});
    passwordsFieldDontMatch: boolean = false;

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            login: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+')]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordConfirmation: ''
        },);
    }

    get form() {
        return this.registerForm.controls;
    }

    onSubmit() {
        console.log(this.registerForm.controls)
        this.submitted = true;
        this.passwordsFieldDontMatch = this.user.password != this.registerForm.get('passwordConfirmation')?.value;
        if (this.registerForm.invalid) {
            return;
        }
        Object.keys(this.user).forEach((key) => {
            const typedKey = key as keyof User;
            this.user[typedKey] = this.registerForm.get(key)?.value
        })
        this.service.register(this.user)
            .pipe(this.errorUtil.returnErrorIfLoginAlreadyExists())
            .subscribe(() => { this.router.navigate(['/login']);},);
    }
}
