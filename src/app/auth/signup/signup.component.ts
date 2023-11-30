import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  userLevel = 999;  // default user access level is guest (can only browse hotels and(?) rooms)
  userDefaultRole = "655c9c445f499d684d2079ba";   // default role is Guest
  userCreated = false;

  constructor (public authService: AuthService) {}

  ngOnInit(): void {
    this.userLevel = this.authService.getAuthUserAccLvl();
  }


  onSignUp(form: NgForm) {
    if (form.invalid) {
      // bail out on invalid form
      this.userCreated = false;
      return;
    }
    this.isLoading = true;

    const user = {
      rv: 0,
      email: form.value.email,
      pwd: form.value.password,
      role_id: form.value.role_id,
      name: form.value.name,
      phone: form.value.phone,
      comments: form.value.comments
    } as User;

    console.log("SignupComponent.onSignUp.user: " + JSON.stringify(user));
    // data OK

    this.userCreated = true;
    this.authService.addUser(user);
  }
}