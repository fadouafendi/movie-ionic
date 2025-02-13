import { Component, OnInit } from '@angular/core';
import { Movie } from '../models/movie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent]
})
export class MoviesPage implements OnInit {
    movies$!: Observable<Movie[]>;
    favoriteMovies: string[] = JSON.parse(sessionStorage.getItem('favoriteMovies') ?? "[]")
    constructor(private movieService: MovieService, private router: Router) {}
  
    ngOnInit() {
      if (!sessionStorage.getItem("connectedUser")) this.router.navigate(["/login"])
      this.movies$ = this.movieService.getMovies();
    }
  addMovie() {
    this.router.navigate(['/add-movie']);
  }

  isFavorite(movie: Movie): boolean {
    if (movie.id)
      return this.favoriteMovies.includes(movie.id);
    else return false
  }

  likeMovie(movie: Movie) {
    console.log('Liked movie:', movie);
    // Implement your like functionality here
  }
  
}
