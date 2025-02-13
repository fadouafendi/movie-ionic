import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: Database) {}

  addUser(u: User): Observable<User> {
    return new Observable<User>(observer => {
      const userRef = ref(this.db, 'users');  
     
      const newUserRef = push(userRef);  
       
      const userWithId = { ...u, id: newUserRef.key };

     
      set(newUserRef, userWithId)
        .then(() => {
          observer.next(userWithId);
          observer.complete();
        })
        .catch(error => {
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
