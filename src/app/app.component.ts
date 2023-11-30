import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // attempt to auto sign in user
    // in case we find authentication data
    // stored in browser's local storage
    this.authService.signinUserAuto();
  }
  
}
