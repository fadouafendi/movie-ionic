import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users.service';
import { User } from '../models/user.model';    
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common'; 
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-movies',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonicModule, NavbarComponent
  ]
})

export class UserComponent implements OnInit {

  users$!: Observable<User[]>; 
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem("connectedUser")) {
      this.router.navigate(["/users"]);
    }
    this.users$ = this.userService.getUsers().pipe(
      map((users: User[]) => users.filter(user => user.role !== 'admin')));  
  }

  isAdmin(){
    console.log({isAdmin: sessionStorage.getItem("connectedUser") === "admin@admin.com"});
    return sessionStorage.getItem("connectedUser") === "admin@admin.com"
  }


  deactivateUser(user: User) {
    this.userService.desactivateUser(user.id!).then(() => {
      user.desactivated = true; 
    }).catch(error => {
      console.error("Failed to deactivate user:", error);
    });
  }
  
  activateUser(user: User) {
    this.userService.activateUser(user.id!).then(() => {
      user.desactivated = false; 
      console.log(user.desactivated);
    }).catch(error => {
      console.error("Failed to activate user:", error);
    });
  }

}
