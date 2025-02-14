import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NavbarComponent  implements OnInit {
  @Input() title: string = "";
  isAdmin = false;
  isMoviesPage = false;


  constructor(private readonly authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAdmin = (sessionStorage.getItem("connectedUser") === "admin@admin.com");
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Adjust this check if you use additional segments or parameters in your /movies route.
        this.isMoviesPage = event.urlAfterRedirects === '/movies';
      });
  }

    goToUsers(){
      this.router.navigate(["/users"]);
    }
  
    goToAddMovie(){
      this.router.navigate(["/add-movie"]);
    }

    goToMovies(){
      this.router.navigate(["/movies"]);
    }

    goToMatch(){
      this.router.navigate(["/match"]);
    }

  async logout(){
    await this.authService.logout()
  }

}
