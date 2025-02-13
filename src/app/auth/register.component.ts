import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/users.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonicModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterPage {
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
    desactivated: false,
    favoriteMovies: [],
    role: 'user'
  };
  password = '';
  errorMessage = '';

  selectedFile: File | null = null;
  uploadedImageUrl: string | null = null;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private userService: UserService) {}


  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  uploadImage() {
    if (!this.selectedFile) return;

    const url = `https://api.cloudinary.com/v1_1/androidmedia/image/upload`;
    const uploadPreset = 'ionicapp';  // Your unsigned preset name

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', uploadPreset);

    this.http.post<any>(url, formData).subscribe(
      (response) => {
        console.log('Upload successful:', response);
        this.uploadedImageUrl = response.secure_url;
        this.user.photo = response.secure_url;
      },
      (error) => {
        console.error('Upload error:', error);
      }
    );
  }

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
      await this.authService.register(this.user.email, this.password, this.user.firstName, this.user.lastName);
      this.userService.addMovie(this.user).subscribe({
              next: (addedUser: User) => {
                console.log("User added:", addedUser.id);
                this.router.navigate(['/login']);
              },
              error: (error) => {
                console.error("Error user movie:", error);
              }
            });
    } catch (error) {
      this.errorMessage = 'Échec de l\'inscription';
    }
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
}