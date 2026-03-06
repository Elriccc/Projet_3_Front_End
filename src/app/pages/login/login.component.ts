import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../user-service';
import { LoginService } from '../../core/service/login.service';
import { User } from '../../core/model/User';
import { AuthUtil } from '../../core/util/auth-util';
import { ErrorUtil } from '../../core/util/error-util';

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
    private loginService = inject(LoginService);
    private authUtil = inject(AuthUtil);
    private errorUtil = inject(ErrorUtil);
    private user: User = {
        login: '',
        password: ''
    }
    loginForm: FormGroup = new FormGroup({});
    submitted: boolean = false;
    userService = inject(UserService);
    loginError: WritableSignal<string> = signal('')

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            login: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+')]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        },);
    }

    get form() {
        return this.loginForm.controls;
    }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        Object.keys(this.user).forEach((key) => {
        const typedKey = key as keyof User;
        this.user[typedKey] = this.loginForm.get(key)?.value
        })

        this.loginService.login(this.user)
        .pipe(this.errorUtil.returnLoginError(this.loginError))
        .subscribe(jwt => {
            this.authUtil.storeLogin(jwt + '', this.user.login);
            this.userService.connect();
            this.router.navigate(['/']);
            }
        )
    }
}
