import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
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

  // Property for a file selected from storage.
  selectedFile: File | null = null;
  // Property for a photo captured by the camera (base64 string).
  capturedImage: string | null = null;
  // After upload, store the Cloudinary URL.
  uploadedImageUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private loadingController: LoadingController
  ) {}

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      // Clear any previously captured camera image.
      this.capturedImage = null;
      this.selectedFile = event.target.files[0];
      // Optionally, you could generate a preview URL from the file here.
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile as Blob);
    }
  }

  /**
   * Uploads the pending image (camera or file) to Cloudinary.
   */
  async uploadImage() {
    // Determine whether to use the camera image or a selected file.
    if (!this.capturedImage && !this.selectedFile) {
      console.error('No image available to upload.');
      return;
    }

    // Create and present the loading spinner.
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    const url = 'https://api.cloudinary.com/v1_1/androidmedia/image/upload';
    const uploadPreset = 'ionicapp'; // Your unsigned preset name
    const formData = new FormData();

    if (this.capturedImage) {
      // If a camera image is available, append it.
      formData.append('file', this.capturedImage);
    } else if (this.selectedFile) {
      // Otherwise, if a file is selected, append the file.
      formData.append('file', this.selectedFile);
    }
    formData.append('upload_preset', uploadPreset);

    this.http.post<any>(url, formData).subscribe(
      async (response) => {
        console.log('Upload successful:', response);
        this.uploadedImageUrl = response.secure_url;
        this.user.photo = response.secure_url;
        // Clear pending image data after successful upload.
        this.capturedImage = null;
        this.selectedFile = null;
        await loading.dismiss();
      },
      async (error) => {
        console.error('Upload error:', error);
        await loading.dismiss();
      }
    );
  }

  ngOnInit() {
    if (
      sessionStorage.getItem('connectedUser') &&
      sessionStorage.getItem('connectedUser') !== ''
    ) {
      this.router.navigate(['/movies']);
    }
  }

  async takePhoto() {
    // Use the auth service to capture a photo.
    const photo = await this.authService.takePhoto();
    if (photo !== null) {
      // Instead of uploading immediately, store the captured image to display a preview.
      this.capturedImage = photo;
      // Clear any previously selected file.
      this.selectedFile = null;
      // Also update the preview image URL.
      this.uploadedImageUrl = photo;
    }
  }

  async register() {
    if (!this.user.email || !this.password || !this.user.firstName || !this.user.lastName) {
      this.errorMessage = 'Tous les champs sont obligatoires !';
      return;
    }
    try {
      await this.authService.register(
        this.user.email,
        this.password,
        this.user.firstName,
        this.user.lastName
      );
      this.userService.addMovie(this.user).subscribe({
        next: (addedUser: User) => {
          console.log('User added:', addedUser.id);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error user movie:', error);
        }
      });
    } catch (error) {
      this.errorMessage = "Échec de l'inscription";
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
