// src/app/services/matching.service.ts
import { Injectable } from '@angular/core';
import { Database, ref, onValue, push, set, update } from '@angular/fire/database';
import { User } from '../models/user.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  constructor(private db: Database, private userService: UserService) {}

  findMatches(currentUserEmail: string): Observable<{ user: User; matchRate: number }[]> {
    return from(this.userService.getUsers()).pipe(
      map(allUsers => {
        const currentUser = allUsers.find(user => user.email === currentUserEmail);
        if (!currentUser) {
          throw new Error('Utilisateur courant non trouvé');
        }

        return allUsers
          .filter(user => user.email !== currentUserEmail && !user.desactivated)
          .map(user => ({
            user,
            matchRate: this.calculateMatchRate(currentUser.favoriteMovies, user.favoriteMovies)
          }))
          .filter(match => match.matchRate >= 75)
          .sort((a, b) => b.matchRate - a.matchRate);
      })
    );
  }


  private calculateMatchRate(movies1: string[], movies2: string[]): number {
    const set1 = new Set(movies1);
    const set2 = new Set(movies2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size ? (intersection.size / union.size) * 100 : 0;
  }
}
