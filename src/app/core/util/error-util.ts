import { Injectable, WritableSignal } from '@angular/core';
import { catchError, Observable, Observer, throwError, OperatorFunction } from 'rxjs';
import { DownloadFile } from '../model/DownloadFile';
import { Router } from '@angular/router';

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

    public returnRetrieveFileByLinkError(router: Router, daysUntilExpired: WritableSignal<number>, loaded: WritableSignal<boolean>): OperatorFunction<DownloadFile, DownloadFile> {
        return catchError<DownloadFile, Observable<DownloadFile>>((error) => {
            if(error.status == 404 || error.status == 500){
                router.navigate(['/']);
            } else if(error.status == 410){
                daysUntilExpired.set(0);
                loaded.set(true);
            }
            return throwError(() => new Error(error));
        });
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

    public returnDownloadError(downloadError: WritableSignal<string>){
        return catchError((error) => {
            if(error.status == 400){
                downloadError.set("Le mot de passe est incorrect");
            } else if(error.status == 404){
                downloadError.set("Le fichier n'existe plus")
            } else if(error.status == 500){
                downloadError.set("Le serveur ne répond pas");
            } else {
                downloadError.set("");
            }
            return throwError(() => new Error(error));
        });
    }
}

