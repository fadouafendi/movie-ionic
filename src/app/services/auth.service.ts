import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore, private storage: Storage) {}


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
    async register(email: string, password: string, firstName: string, lastName: string, photoBase64: string | null) {
        try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        let photoURL = '';

        if (photoBase64) {
            photoURL = await this.uploadPhoto(user.uid, photoBase64);
        }

        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        await setDoc(userDocRef, {
            firstName,
            lastName,
            email,
            photoURL
        });

        return user;
        } catch (error) {
            console.error("Erreur d'inscription :", error);
        throw error;
        }
    }

  // Connexion avec email & mot de passe
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Erreur de connexion :", error);
      throw error;
    }
  }

  // Déconnexion
  async logout() {
    await signOut(this.auth);
  }
}
