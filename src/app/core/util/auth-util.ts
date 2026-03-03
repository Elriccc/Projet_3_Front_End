import { inject, Injectable } from '@angular/core';
import { LoginService } from '../service/login.service'
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../user-service';

@Injectable({
    providedIn: 'root'
})
export class AuthUtil {
    private service = inject(LoginService);
    private userService = inject(UserService);

    public initAuth() {
        this.isAuthenticated().then((isAuth) => {
            if(isAuth) {
                this.userService.connect();
            } else {
                this.userService.disconnect();
            }
        });
    }

    public async isAuthenticated(): Promise<boolean> {
        const token: string = sessionStorage.getItem('accessToken') ?? '';
        if(token === '') {
            return false;
        }
        const response = await firstValueFrom(
            this.service.isAuthTokenCorrect(token)
        );
        return !!response;
    }

    public storeLogin(token: String, login: String) {
        sessionStorage.clear()
        sessionStorage.setItem('accessToken', token.toString())
    }

    public disconnect() {
        sessionStorage.clear();
        this.userService.disconnect();
    }
}