import { Component, OnInit } from '@angular/core';
import { Movie } from '../models/movie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MovieService } from '../services/movie.service';
import { UserService } from '../services/users.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { User } from '../models/user.model';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent]
})
export class MoviesPage implements OnInit {
  movies$!: Observable<Movie[]>;
  // Load favorite movies from session storage (which contains an array of movie ids)
  favoriteMovies: string[] = JSON.parse(sessionStorage.getItem('favoriteMovies') ?? "[]");

  constructor(
    private movieService: MovieService, 
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check for connected user by email in session storage
    const connectedUserEmail = sessionStorage.getItem("connectedUser");
    if (!connectedUserEmail) {
      this.router.navigate(["/login"]);
    }
    this.movies$ = this.movieService.getMovies();
  }

  addMovie() {
    this.router.navigate(['/add-movie']);
  }

  isFavorite(movie: Movie): boolean {
    console.log({movie, isFavorite: movie.id ? this.favoriteMovies.includes(movie.id) : false});
    
    return movie.id ? this.favoriteMovies.includes(movie.id) : false;
  }

  // Updated method to toggle the favorite status and update the connected user's favoriteMovies list
  toggleFavorite(movie: Movie) {
    if (!movie.id) return;
    
    const index = this.favoriteMovies.indexOf(movie.id);
    
    if (index === -1) {
      // Movie is not currently a favorite: add it
      this.favoriteMovies.push(movie.id);
      movie.favoriteCount++;
    } else {
      // Movie is already a favorite: remove it
      this.favoriteMovies.splice(index, 1);
      movie.favoriteCount = Math.max(0, movie.favoriteCount - 1);
    }
    
    // Persist the updated favoriteMovies list to sessionStorage
    sessionStorage.setItem('favoriteMovies', JSON.stringify(this.favoriteMovies));

    // Update the movie's favoriteCount in the database
    this.movieService.updateMovie(movie).subscribe({
      next: () => {
        // Optionally log success or update the UI further
      },
      error: (error) => {
        console.error("Error updating movie:", error);
      }
    });

    // Retrieve the connected user's email from sessionStorage
    const connectedUserEmail = sessionStorage.getItem("connectedUser");
    if (connectedUserEmail) {
      // Use the email to fetch the full user instance from the database
      this.userService.getUserByEmail(connectedUserEmail)
        .then((user: User | null) => {
          if (user && user.id) {
            // Update the user's favoriteMovies list in the database
            this.userService.updateUserFavoriteMovies(user.id, this.favoriteMovies)
              .then(() => {
                // Optionally, you may want to update sessionStorage with the full user instance now.
                console.log("User favoriteMovies updated successfully.");
              })
              .catch((error: any) => {
                console.error("Error updating user's favoriteMovies:", error);
              });
          } else {
            console.error("User not found in database for email:", connectedUserEmail);
          }
        })
        .catch((error: any) => {
          console.error("Error fetching user by email:", error);
        });
    }
  }
}
