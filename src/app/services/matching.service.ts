// src/app/services/matching.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  constructor(private firestore: AngularFirestore) {}

  findMatches(currentUserId: string): Observable<{ user: User; matchRate: number }[]> {
    return from(this.getAllUsersWithFavorites()).pipe(
      map(allUsers => {
        const currentUser = allUsers.find(user => user.id === currentUserId);
        if (!currentUser) {
          throw new Error('Utilisateur courant non trouvé');
        }

        return allUsers
          .filter(user => user.id !== currentUserId && !user.desactivated)
          .map(user => ({
            user,
            matchRate: this.calculateMatchRate(currentUser.favoriteMovies, user.favoriteMovies)
          }))
          .filter(match => match.matchRate >= 75)
          .sort((a, b) => b.matchRate - a.matchRate);
      })
    );
  }

  private async getAllUsersWithFavorites(): Promise<User[]> {
    const snapshot = await this.firestore.collection<User>('users').get().toPromise();
    return snapshot?.docs.map(doc => ({ ...doc.data(), uid: doc.id })) || [];
  }

  // canger le type de movies 1 et 2 en Movie type et continuer les changements 
  private calculateMatchRate(movies1: string[], movies2: string[]): number {
    const set1 = new Set(movies1);
    const set2 = new Set(movies2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return (intersection.size / union.size) * 100;
  }
}