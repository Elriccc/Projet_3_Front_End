import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service'
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthUtils {
    private service = inject(AuthService)

    public async isAuthenticated(): Promise<boolean> {
        const token: string = sessionStorage.getItem('accessToken') ?? '';
        const response = await firstValueFrom(
            this.service.isAuthTokenCorrect(token)
        );
        return !!response;
    }

    public setToken(token: String) {
        sessionStorage.clear()
        sessionStorage.setItem('accessToken', token.toString())
    }
}