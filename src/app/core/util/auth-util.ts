import { inject, Injectable, WritableSignal } from '@angular/core';
import { LoginService } from '../service/login.service'
import { catchError, firstValueFrom, Observable, of, throwError } from 'rxjs';
import { UserService } from '../../user-service';

@Injectable({
    providedIn: 'root'
})
export class AuthUtil {
    private service = inject(LoginService);
    private userService = inject(UserService);

    public initAuth(loaded: WritableSignal<boolean>) {
        this.isAuthenticated().then((isAuth) => {
            if(isAuth) {
                this.userService.connect();
            } else {
                this.userService.disconnect();
            }
            loaded.set(true);
        });
    }

    public async isAuthenticated(): Promise<boolean> {
        const token: string = sessionStorage.getItem('accessToken') ?? '';
        if(token === '') {
            this.disconnect();
            return false;
        }
        const response = await firstValueFrom(
            this.service.isAuthTokenCorrect(token).pipe(catchError(() => of(false)))
        );
        if(response == false){
            this.disconnect();
        }
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