import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ref as dbRef, equalTo, get, getDatabase, orderByChild, query } from '@angular/fire/database';
import { User as AppUser} from '../models/user.model';
import { UserService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage, private router: Router, private userService: UserService) {}


  // Prendre une photo
  async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      return image.base64String ? `data:image/jpeg;base64,${image.base64String}` : null;
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      return null;
    }
  }

  // Upload la photo vers Firebase
  async uploadPhoto(userId: string, base64Image: string): Promise<string> {
    const imageRef = ref(this.storage, `profilePictures/${userId}.jpg`);
    await uploadString(imageRef, base64Image, 'data_url');
    return await getDownloadURL(imageRef);
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
        // If the query returns multiple children (though typically you expect one),
        // iterate and take the first matching record.
        let userData: any = null;
        snapshot.forEach(childSnapshot => {
          userData = childSnapshot.val();
          // Break out of the loop after the first match.
          return true;
        });
        
        // If userData was found, create a User instance.
        if (userData) {
          return userData
        }
      }
      
      // If no user was found, return null.
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

      if (user.desactivated){
        throw new Error("No connected user email found in session storage.");
        }
       
     
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userEmail = userCredential.user.email ?? "";
     
      // Save connected user email to session storage
      sessionStorage.setItem("connectedUser", userEmail);

      const connectedUser = await this.getCurrentUser()
   
      sessionStorage.setItem("favoriteMovies", JSON.stringify(connectedUser.favoriteMovies ?? []))
      
      return userCredential.user;
    } catch (error) {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  }

  // Déconnexion
  async logout() {
    sessionStorage.clear()
    await signOut(this.auth);
    this.router.navigate(["login"])
  }
}
