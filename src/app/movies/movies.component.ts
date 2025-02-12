import { Component, OnInit } from '@angular/core';
import { Movie } from '../models/movie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MoviesPage implements OnInit {
    movies$!: Observable<Movie[]>;

    constructor(private movieService: MovieService, private router: Router) {}
  
    ngOnInit() {
      this.movies$ = this.movieService.getMovies();
    }
  addMovie() {
    this.router.navigate(['/add-movie']);
  }
}
