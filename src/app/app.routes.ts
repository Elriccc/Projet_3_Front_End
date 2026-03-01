import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UploadComponent } from './pages/upload/upload.component';
import { HomeComponent } from './pages/home/home.component';
import { DownloadComponent } from './pages/download/download.component';
import { AccountComponent } from './pages/account/account.component';
import { MyFilesComponent } from './pages/account/my-files/my-files.component';
import { userGuard } from './user-guard.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'upload', component: UploadComponent },
    { path: 'download', component: DownloadComponent},
    { path: 'account', component: AccountComponent,children: [
        { path: 'my-files', component: MyFilesComponent }
    ]}
];
