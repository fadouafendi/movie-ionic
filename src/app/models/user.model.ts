
export interface User {
    id?: string | null; 
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    desactivated: boolean;
    favoriteMovies: string[]
    role: 'user' | 'admin';
  }