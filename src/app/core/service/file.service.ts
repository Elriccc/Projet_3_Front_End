import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFile } from '../model/UploadFile';
import { DownloadFile } from '../model/DownloadFile';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor(private httpClient: HttpClient) { }

  upload(uploadFile: UploadFile): Observable<DownloadFile> {
    let formData = new FormData();
    formData.append('file', uploadFile.file);
    formData.append('expirationTime', uploadFile.expirationTime+'');
    formData.append('password', uploadFile.password);
    return this.httpClient.post<DownloadFile>('/api/files', formData, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}});
  }

  retrieveAllFiles(): Observable<DownloadFile[]> {
    return this.httpClient.get<DownloadFile[]>('/api/files', {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}})
  }

  retrieveFileByLink(fileLinkPath: string): Observable<DownloadFile> {
    return this.httpClient.get<DownloadFile>('/api/files/' + fileLinkPath, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}});
  }

  download(fileLinkPath: string, password: string | undefined): Observable<Object> {
    return this.httpClient.post('/api/files/download/' + fileLinkPath, password, {responseType: 'blob', headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}});
  }

  delete(fileLinkPath: string) {
    return this.httpClient.delete('/api/files/' + fileLinkPath, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}});
  }

  updateTags(fileLinkPath: string, tags: string[]) {
    return this.httpClient.put('/api/files/' + fileLinkPath, {tags}, {headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')}});
  }
}
