import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem("connectedUser") && sessionStorage.getItem("connectedUser") !== "") this.router.navigate(["/movies"])
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.email, this.password = '', '';
      this.router.navigate(['/movies']);
    } catch (error) {
      console.error('Erreur de connexion', error);
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}