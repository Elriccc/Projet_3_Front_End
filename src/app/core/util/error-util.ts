import { Injectable, WritableSignal } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtil{

    public returnRegisterError(registerError: WritableSignal<string>) {
        return catchError(error => {
            if(error.status == 400){
                registerError.set("L'email choisit existe déjà");
            } else if(error.status == 500){
                registerError.set("Le serveur ne répond pas");
            } else {
                registerError.set("");
            }
            return throwError(() => new Error(error))
        })
    }

    public returnErrorIfBadLoginOrPwd() {
        return catchError(error => {
            alert('Email ou mot de passe incorrect');
            return throwError(() => new Error(error))
        })
    }
}