import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MatchingService } from '../services/matching.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss'],
})
export class MatchingComponent  implements OnInit {

  matches$: Observable<{ user: User; matchRate: number }[]> = of([]);
  
  constructor(
    private matchingService: MatchingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadMatches();
  }

  loadMatches() {
    this.matches$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user && user.id) {
          return this.matchingService.findMatches(user.id);
        } else {
          throw new Error('Utilisateur non connecté');
        }
      })
    );
  }

}
