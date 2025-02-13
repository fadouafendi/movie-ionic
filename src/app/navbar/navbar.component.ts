import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class NavbarComponent  implements OnInit {
  @Input() title: string = "";
  constructor(private readonly authService: AuthService, private router: Router) { }

  ngOnInit() {}

  async logout(){
    await this.authService.logout()
  }

}
