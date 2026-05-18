import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'translate', component: Home },
  { path: 'youtube', component: Home },
  { path: '**', redirectTo: '' }
];
