import { Injectable, WritableSignal } from '@angular/core';
import { catchError, Observable, Observer, throwError, OperatorFunction } from 'rxjs';
import { DownloadFile } from '../model/DownloadFile';

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

    public returnLoginError(loginError: WritableSignal<string>) {
        return catchError(error => {
            if(error.status == 400){
                loginError.set('Email ou mot de passe incorrect');
            } else if(error.status == 500){
                loginError.set("Le serveur ne répond pas");
            } else {
                loginError.set("");
            }
            return throwError(() => new Error(error))
        })
    }

    public returnUploadError(uploadError: WritableSignal<string>): OperatorFunction<DownloadFile, DownloadFile> {
        return catchError<DownloadFile, Observable<DownloadFile>>((error) => {
            if(error.status == 400){
                uploadError.set("L'extension du fichier est incorrect, compressez-le en .zip si vous souhaitez tout de même le téléverser");
            } else if(error.status == 500){
                uploadError.set("Le serveur ne répond pas");
            } else {
                uploadError.set("");
            }
            return throwError(() => new Error(error));
        });
    }
}

