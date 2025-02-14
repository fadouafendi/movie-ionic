// src/app/matching/matching.component.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MatchingService } from '../services/matching.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-matching',
  standalone: true,
  imports: [IonicModule, CommonModule, NavbarComponent],
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss'],
})
export class MatchingComponent implements OnInit {

  matches$: Observable<{ user: User; matchRate: number }[]> = of([]);
  
  constructor(
    private matchingService: MatchingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem("connectedUser")) {
      this.router.navigate(["/users"]);
    }
    this.loadMatches();
  }

 async loadMatches() {
    const currentUser = await this.authService.getCurrentUser();    
    this.matches$ = this.matchingService.findMatches(currentUser.email);
    
  }
}
