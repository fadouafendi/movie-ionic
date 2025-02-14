import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set, update, get } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: Database) { }

  addUser(u: User): Observable<User> {
    return new Observable<User>(observer => {

      const usersRef = ref(this.db, 'users');

      // Create a new child reference with a unique key
      const newUserRef = push(usersRef);

      // Write the movie data to the new reference
      set(newUserRef, u)
        .then(() => {
          // Update the movie object with its generated id
          u.id = newUserRef.key;
          // Emit the movie back to the observer
          observer.next(u);
          observer.complete();
        })
        .catch(error => {
          // Emit the error if the write fails
          observer.error(error);
        });
    });
  }

  getUsers(): Observable<User[]> {
    return new Observable<User[]>(observer => {
      const usersRef = ref(this.db, 'users');

      const unsubscribe = onValue(usersRef, (snapshot) => {
        const data = snapshot.val();


        const users: User[] = data
          ? Object.keys(data).map(key => ({ id: key, ...data[key] }))
          : [];

        observer.next(users);
      }, (error) => {
        observer.error(error);
      });


      return () => unsubscribe();
    });
  }

  desactivateUser(userId: string): Promise<void> {
    const userRef = ref(this.db, `users/${userId}`);
    return update(userRef, { desactivated: true });
  }

  
  updateUserFavoriteMovies(userId: string, favoriteMovies: string[]): Promise<void> {
    const userRef = ref(this.db, `users/${userId}`);
    return update(userRef, { favoriteMovies });
  }


  activateUser(userId: string): Promise<void> {
    const userRef = ref(this.db, `users/${userId}`);
    return update(userRef, { desactivated: false }); 
  }

  getUserById(userId: string): Observable<User | null> {
    const userRef = ref(this.db, `users/${userId}`);
    return from(get(userRef).then(snapshot => snapshot.exists() ? snapshot.val() as User : null));
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersRef = ref(this.db, 'users');
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) return null;

      const users = snapshot.val();

      // Find the user with the matching email
      const userKey = Object.keys(users).find(key => users[key].email === email);

      if (!userKey) return null;

      return { id: userKey, ...users[userKey] } as User;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }
}
