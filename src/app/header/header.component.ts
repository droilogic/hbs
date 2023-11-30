import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {
  userAuthenticated = false;
  userAccLvl = 999;
  userName: string;
  private authListenerSubscription: Subscription;

  constructor (private authService: AuthService) {}

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getAuthStatus();
    this.userName = this.authService.getAuthUserName();
    this.userAccLvl = this.authService.getAuthUserAccLvl();
    this.authListenerSubscription = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userAuthenticated = isAuth;
      this.userName = this.authService.getAuthUserName();
      this.userAccLvl = this.authService.getAuthUserAccLvl();
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }

  onSignOut() {
    this.authService.signoutUser();
  }
}
