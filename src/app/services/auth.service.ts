import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import {
  ref as dbRef,
  equalTo,
  get,
  getDatabase,
  orderByChild,
  query
} from '@angular/fire/database';
import { UserService } from '../services/users.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<FirebaseUser | null>(null);
  user$: Observable<FirebaseUser | null> = this.userSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private auth: Auth,
    private router: Router,
    private userService: UserService
  ) {}

  // Prendre une photo via la caméra
  async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      // Return a proper data URL if image.base64String exists.
      return image.base64String ? `data:image/jpeg;base64,${image.base64String}` : null;
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      return null;
    }
  }

  // Register
  async register(email: string, password: string, firstName: string, lastName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      return user;
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      // Retrieve the email of the connected user from session storage.
      const email = sessionStorage.getItem("connectedUser");
      if (!email) {
        throw new Error("No connected user email found in session storage.");
      }
  
      // Get a reference to the Firebase Realtime Database.
      const db = getDatabase();
      
      // Reference the 'users' node.
      const usersRef = dbRef(db, "users");
      
      // Create a query to find a user with the matching email.
      const userQuery = query(usersRef, orderByChild("email"), equalTo(email));
      
      // Execute the query.
      const snapshot = await get(userQuery);
      
      if (snapshot.exists()) {
        let userData: any = null;
        snapshot.forEach(childSnapshot => {
          userData = childSnapshot.val();
          return true;
        });
        
        if (userData) {
          return userData;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
  
  // Connexion avec email & mot de passe
  async login(email: string, password: string) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return null;
      }
      if (user.desactivated) {
        this.toastService.presentToast(
          'Your account has been deactivated. Please contact Support or Admin!',
          3000,
          'top'
        );
        throw new Error("No connected user email found in session storage.");
      }
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userEmail = userCredential.user.email ?? "";
      
      sessionStorage.setItem("connectedUser", userEmail);
      const connectedUser = await this.getCurrentUser();
      sessionStorage.setItem("favoriteMovies", JSON.stringify(connectedUser.favoriteMovies ?? []));
      
      return userCredential.user;
    } catch (error) {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  }

  // Déconnexion
  async logout() {
    sessionStorage.clear();
    await signOut(this.auth);
    this.router.navigate(["login"]);
  }
}
