import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { BookingService } from '../booking-service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.css']
})
export class BookingCreateComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  userDisplayData = "";
  private opMode = "create";
  private bookingId = "";  // used to store booking id when in EDIT mode

  constructor(private bookingService: BookingService, public route: ActivatedRoute, private router: Router, private authService: AuthService) {}


  ngOnInit(): void {
    // check if the current logged in user has the required access level for this page
    // effectively, only guests do not have access - authorization should anyways DENY access to this page if not logged in
    if (this.authService.getAuthUserAccLvl() >= 999) {
      this.router.navigate(["/signin"]);
    }

    // this is for displaying the user that owns this booking
    this.userDisplayData = this.authService.getAuthUserName();

    this.form = new FormGroup({
      "hotel_id": new FormControl(null, { validators: [
        Validators.required
      ]}),
      "guest_name": new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(5)
      ]}),
      "guest_email": new FormControl(null, { validators: [
        Validators.required,
        Validators.email
      ]}),
      "guest_address": new FormControl(null, { validators: [
        Validators.maxLength(50)
      ]}),
      "guest_phone": new FormControl(null, { validators: [
        Validators.required,
        Validators.maxLength(30)
      ]}),
      "room": new FormControl(null, { validators: [
        Validators.required,
        Validators.min(1)
      ]}),
      "persons": new FormControl(null, { validators: [
        Validators.required
      ]}),
      "checkin": new FormControl(null, { validators: [
        Validators.required
      ]}),
      "checkout": new FormControl(null, { validators: [
        Validators.required
      ]}),
      "price": new FormControl(null, { validators: [
        Validators.required
      ]}),
      "comments": new FormControl(null, { validators: [
        Validators.maxLength(250)
      ]})
    });

    
  }
}

