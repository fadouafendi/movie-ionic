import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterPage {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
    isActive: true,
    favoriteMovies: [],
    role: 'user'
  };
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit() {
    if (sessionStorage.getItem("connectedUser") && sessionStorage.getItem("connectedUser") !== "") this.router.navigate(["/movies"])
  }

  async takePhoto() {
    const photo = await this.authService.takePhoto();
    if (photo !== null) {
      this.user.photo = photo;
    }
  }

  async register() {
    if (!this.user.email || !this.password || !this.user.firstName || !this.user.lastName ) {
      this.errorMessage = 'Tous les champs sont obligatoires !';
      return;
    }
    try {
      await this.authService.register(this.user.email, this.password, this.user.firstName, this.user.lastName, this.user.photo);
      console.log('Inscription réussite');
    } catch (error) {
      this.errorMessage = 'Échec de l\'inscription';
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}