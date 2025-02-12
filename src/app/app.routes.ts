import { Routes } from '@angular/router';
import { LoginComponent } from './auth/auth.component';
import { RegisterPage } from './auth/register.component';
import { MoviesPage } from './movies/movies.component';
import { AddMoviePage } from './add-movie/add-movie.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterPage },
  { path: 'movies', component: MoviesPage },
  { path: 'add-movie', component: AddMoviePage }
];
