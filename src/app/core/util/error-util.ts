import { Injectable, WritableSignal } from '@angular/core';
import { catchError, Observable, throwError, OperatorFunction, EMPTY } from 'rxjs';
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
                return EMPTY;
            } else if(error.status == 500){
                registerError.set("Le serveur ne répond pas");
                return EMPTY;
            } else {
                registerError.set("");
            }
            return throwError(() => error)
        })
    }

    public returnLoginError(loginError: WritableSignal<string>) {
        return catchError(error => {
            if(error.status == 400){
                loginError.set('Email ou mot de passe incorrect');
                return EMPTY;
            } else if(error.status == 500){
                loginError.set("Le serveur ne répond pas");
                return EMPTY;
            } else {
                loginError.set("");
            }
            return throwError(() => error)
        })
    }

    public returnRetrieveFileByLinkError(router: Router, daysUntilExpired: WritableSignal<number>, loaded: WritableSignal<boolean>): OperatorFunction<DownloadFile, DownloadFile> {
        return catchError<DownloadFile, Observable<DownloadFile>>((error) => {
            if(error.status == 404 || error.status == 500){
                router.navigate(['/']);
                return EMPTY;
            } else if(error.status == 410){
                daysUntilExpired.set(0);
                loaded.set(true);
                return EMPTY;
            } else if(error.status == 500){
                return EMPTY;
            }
            return throwError(() => error);
        });
    }

    public returnUploadError(uploadError: WritableSignal<string>): OperatorFunction<DownloadFile, DownloadFile> {
        return catchError<DownloadFile, Observable<DownloadFile>>((error) => {
            if(error.status == 400){
                uploadError.set("L'extension du fichier est incorrect, compressez-le en .zip si vous souhaitez tout de même le téléverser");
                return EMPTY;
            } else if(error.status == 500){
                uploadError.set("Le serveur ne répond pas");
                return EMPTY;
            } else {
                uploadError.set("");
            }
            return throwError(() => error);
        });
    }

    public returnDownloadError(downloadError: WritableSignal<string>){
        return catchError((error) => {
            if(error.status == 400){
                downloadError.set("Le mot de passe est incorrect");
                return EMPTY;
            } else if(error.status == 404){
                downloadError.set("Le fichier n'existe plus")
                return EMPTY;
            } else if(error.status == 500){
                downloadError.set("Le serveur ne répond pas");
                return EMPTY;
            } else {
                downloadError.set("");
            }
            return throwError(() => error);
        });
    }
}

