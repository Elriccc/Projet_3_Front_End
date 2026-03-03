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
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }
        Object.keys(this.user).forEach((key) => {
            const typedKey = key as keyof User;
            this.user[typedKey] = this.registerForm.get(key)?.value
        })
        if(this.user.password != this.registerForm.get('passwordConfirmation')?.value){
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        this.service.register(this.user)
            .pipe(this.errorUtil.returnErrorIfLoginAlreadyExists())
            .subscribe(() => { this.router.navigate(['/login']);},);
    }
}
