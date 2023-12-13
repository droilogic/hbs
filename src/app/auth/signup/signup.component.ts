import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubscription: Subscription;
  userLevel = 999;  // default user access level is guest (can only browse hotels and(?) rooms)
  userDefaultRole = "655c9c445f499d684d2079ba";   // default role is Guest
  userCreated = false;

  constructor (public route: ActivatedRoute, private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.userLevel = this.authService.getAuthUserAccLvl();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }


  onSignUp(form: NgForm) {
    if (form.invalid) {
      // bail out on invalid form
      this.userCreated = false;
      return;
    }
    this.isLoading = true;
    // takes care of role_id when disabled
    // ie: signing up as new user
    let formRoleId = form.value.role_id;
    if (!formRoleId) {
      formRoleId = this.userDefaultRole;
    }

    const user = {
      rv: 0,
      email: form.value.email,
      pwd: form.value.password,
      role_id: formRoleId,
      name: form.value.name,
      phone: form.value.phone,
      comments: form.value.comments
    } as User;

    console.log("SignupComponent.onSignUp.user: " + JSON.stringify(user));
    // data OK

    this.authService.addUser(user);
    this.userCreated = true;
    this.isLoading = false;
    console.log("signup-component.onSaveUser.onSignUp(): " + JSON.stringify(user));
    form.reset();
  }
}