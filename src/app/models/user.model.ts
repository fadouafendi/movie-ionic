import { Movie } from "./movie.model";

export interface User {
    id?: string | null; 
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    isActive: boolean;
    desactivated: boolean;
    favoriteMovies: Movie[]
    role: 'user' | 'admin';
  }