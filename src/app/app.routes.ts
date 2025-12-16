import { Routes } from '@angular/router';
import { UploadComponent } from './components/upload/upload.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'upload',
        component: UploadComponent
    },
    {
        path: 'chat',
        component: ChatComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];