import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private db: Database) {}

  addMovie(m: Movie): Observable<Movie> {
    return new Observable<Movie>(observer => {
      const moviesRef = ref(this.db, 'movies');
      const newMovieRef = push(moviesRef);
      set(newMovieRef, m)
        .then(() => {
          m.id = newMovieRef.key;
          observer.next(m);
          observer.complete();
        })
        .catch(error => {
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

  // New method to update a movie (in this case, only updating the favoriteCount)
  updateMovie(movie: Movie): Observable<Movie> {
    return new Observable<Movie>(observer => {
      if (!movie.id) {
        observer.error("Movie must have an id");
        return;
      }
      const movieRef = ref(this.db, 'movies/' + movie.id);
      update(movieRef, { favoriteCount: movie.favoriteCount })
        .then(() => {
          observer.next(movie);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}
