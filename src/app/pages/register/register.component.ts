import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
    registerError: WritableSignal<string> = signal('');

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

    onPasswordConfirmationChange() {
        this.passwordsFieldDontMatch = this.registerForm.get('password')?.value != this.registerForm.get('passwordConfirmation')?.value;
    }

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        Object.keys(this.user).forEach((key) => {
            const typedKey = key as keyof User;
            this.user[typedKey] = this.registerForm.get(key)?.value
        })
        this.service.register(this.user)
            .pipe(this.errorUtil.returnRegisterError(this.registerError))
            .subscribe(() => { this.router.navigate(['/login']);},);
    }
}
