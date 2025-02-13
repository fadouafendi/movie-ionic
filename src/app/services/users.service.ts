import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: Database) {}

  addMovie(u: User): Observable<User> {
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
}
