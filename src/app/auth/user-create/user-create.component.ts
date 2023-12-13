import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  userDefaultRole = "655c9c445f499d684d2079ba";   // default role is Guest
  user:User = { id: "", rv: 0, email: "", pwd: "", role_id: this.userDefaultRole, name: "", phone: "", comments: "" };
  isLoading = false;
  form: FormGroup;
  private opMode = "create";
  private userId = "";  // used to store id when in EDIT mode

  constructor(public route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {

    // check if the current logged in use has the required access level for this page
    if (this.authService.getAuthUserAccLvl() >= 100) {
      this.router.navigate(["/hotel-list"]);
    }
    if (this.authService.getAuthUserAccLvl() >= 10) {
      this.router.navigate(["/user-list"]);
    }

    this.form = new FormGroup({
      "email": new FormControl(null, { validators: [
        Validators.required,
        Validators.email
      ]}),
      "password": new FormControl(null, { validators: [
        Validators.required,
        Validators.maxLength(50)
      ]}),
      "role_id": new FormControl(null, { validators: [
        Validators.required
      ]}),
      "name": new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(5)
      ]}),
      "phone": new FormControl(null, { validators: [
        Validators.maxLength(50)
      ]}),
      "comments": new FormControl(null, { validators: [
        Validators.maxLength(250)
      ]})
    });

    this.route.paramMap.subscribe((pm: ParamMap) => {
      if (pm.has("userid")) {
        this.isLoading = true;
        this.opMode = "edit";
        this.userId = pm.get("userid");
        this.authService.getUserById(this.userId).subscribe(userData => {
          this.user = {
            id: userData.data._id,
            rv: userData.data.rv,
            email: userData.data.email,
            pwd: "",
            role_id: userData.data.role_id,
            name: userData.data.name,
            phone: userData.data.phone,
            comments: userData.data.comments
          };
          this.form.setValue({
            "email": this.user.email,
            "password": this.user.pwd,
            "role_id": this.user.role_id,
            "name": this.user.name,
            "phone": this.user.phone,
            "comments": this.user.comments
          });

          this.isLoading = false;
        });
      } else {
        this.opMode = "create";
        this.userId = "";
      }
    });
  }

  onSaveUser() {

    if(this.form.invalid) {
      console.log("user-create-component.onSaveUser: return from invalid form.");
      return;
    }

    // no need to set it back to false since we will navigate away from the current page
    // and isLoading will be initialized to false
    this.isLoading = true;
    if (this.opMode === "create") {
      const newUser = {
        id: "",
        rv: 0,
        email: this.form.value.email,
        pwd: this.form.value.password,
        role_id: this.form.value.role_id,
        name: this.form.value.name,
        phone: this.form.value.phone,
        comments: this.form.value.comments
      };
      console.log("user-create-component.onSaveUser.addUser(" + this.opMode + "): " + JSON.stringify(newUser));
      this.authService.addUser(newUser);
      console.log("user-create-component.onSaveUser, redirecting to /signup");
      this.router.navigate(["/signup"]);
    } else if (this.opMode === "edit") {
      const newUser = {
        id: this.userId,
        rv: this.user.rv,
        email: this.form.value.email,
        pwd: this.form.value.password,
        role_id: this.form.value.role_id,
        name: this.form.value.name,
        phone: this.form.value.phone,
        comments: this.form.value.comments
      };

      console.log("user-create-component.onSaveUser.addUser(" + this.opMode + "): " + JSON.stringify(newUser));
      this.authService.updateUser(newUser);
    }
    // clear the form
    // this.form.reset();
  }

}
