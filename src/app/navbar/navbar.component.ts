import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NavbarComponent  implements OnInit {
  @Input() title: string = "";
  isAdmin = false
  constructor(private readonly authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.isAdmin = (sessionStorage.getItem("connectedUser") === "admin@admin.com");
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

  async logout(){
    await this.authService.logout()
  }

}
