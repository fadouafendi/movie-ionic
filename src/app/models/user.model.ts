import { Movie } from "./movie.model";

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    isActive: boolean;
    favoriteMovies: Movie[]
    role: 'user' | 'admin';
  }