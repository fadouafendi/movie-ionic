import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';


@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private db: Database) {}


  addMovie(m: Movie): Observable<Movie> {
    return new Observable<Movie>(observer => {
      // Reference to the 'movies' node in your Realtime Database
      const moviesRef = ref(this.db, 'movies');
      
      // Create a new child reference with a unique key
      const newMovieRef = push(moviesRef);
      
      // Write the movie data to the new reference
      set(newMovieRef, m)
        .then(() => {
          // Update the movie object with its generated id
          m.id = newMovieRef.key;
          // Emit the movie back to the observer
          observer.next(m);
          observer.complete();
        })
        .catch(error => {
          // Emit the error if the write fails
          observer.error(error);
        });
    });
  }

  getMovies(): Observable<Movie[]> {
    return new Observable<Movie[]>(observer => {
      const moviesRef = ref(this.db, 'movies'); 
      const unsubscribe = onValue(moviesRef, (snapshot) => {
        const data = snapshot.val();
        
        const movies: Movie[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        
        observer.next(movies);
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }
}
