import { Routes } from '@angular/router';
import { LoginComponent } from './auth/auth.component';
import { RegisterPage } from './auth/register.component';
import { MoviesPage } from './movies/movies.component';
import { AddMoviePage } from './add-movie/add-movie.component';
import { UserComponent } from './user/user.component';
import { MatchingComponent } from './matching/matching.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterPage },
  { path: 'movies', component: MoviesPage },
  { path: 'add-movie', component: AddMoviePage },
  { path:'users', component: UserComponent},
  { path:'match', component: MatchingComponent}
];
