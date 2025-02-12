export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    photo: string;
    isActive: boolean;
    role: 'user' | 'admin';
  }