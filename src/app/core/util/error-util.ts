import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorUtil{

    public returnErrorIfLoginAlreadyExists() {
        return catchError(error => {
            if(error.status == 400){
                alert("L'email choisit existe déjà");
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