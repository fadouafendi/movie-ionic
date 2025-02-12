import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Observable } from 'rxjs';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
    private moviesCollection;

    constructor(private firestore: Firestore) {
      this.moviesCollection = collection(this.firestore, 'movies');
    }
  
    getMovies(): Observable<Movie[]> {
      return collectionData(this.moviesCollection, { idField: 'id' }) as Observable<Movie[]>;
    }
  
    addMovie(movie: Movie) {
      return addDoc(this.moviesCollection, movie);
    }
}
