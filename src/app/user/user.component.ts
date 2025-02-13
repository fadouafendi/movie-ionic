import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users.service';
import { User } from '../models/user.model';    
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-movies',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
  ]
})

export class UserComponent implements OnInit {

  users$!: Observable<User[]>; 
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (!sessionStorage.getItem("connectedUser")) {
      this.router.navigate(["/users"]);
    }
    this.users$ = this.userService.getUsers();  
  }
}
