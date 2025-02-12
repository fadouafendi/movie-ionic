import { Component } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class AddMoviePage {
  movie: Movie = { title: '', genre: '', year: new Date().getFullYear(), imageUrl: '' };

  constructor(private movieService: MovieService, private router: Router) {}

  saveMovie() {
    if (this.movie.title && this.movie.genre && this.movie.year) {
      this.movieService.addMovie(this.movie);
      this.router.navigate(['/movies']);
    }
  }
}
