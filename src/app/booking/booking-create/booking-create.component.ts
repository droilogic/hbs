import * as moment from 'moment';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { Booking } from '../../interfaces/booking';
import { BookingService } from '../booking.service';
import { Hotel } from '../../interfaces/hotel';
import { HotelService } from '../../hotel/hotel.service';

@Component({
  selector: 'app-booking-create',
  templateUrl: './booking-create.component.html',
  styleUrls: ['./booking-create.component.css']
})
export class BookingCreateComponent implements OnInit, OnDestroy {

  dt1 = new Date(Date.UTC(2024, 1, 1, 0, 0, 0, 0));
  dt2 = new Date(Date.UTC(2024, 12, 31, 23, 59, 59, 999));

  booking:Booking = {
    id: "",
    rv: 0,
    user_id: "",
    hotel_id: "655c6677a50fccbf41c7c8a8",
    guest_name: "Jean Baptiste Emmanuel Zorg",
    guest_email: "jean@zorg.org",
    guest_address: "",
    guest_phone: "+99 11 0123 4567",
    room: "Royal Suite",
    persons: 1,
    checkin: this.dt1,
    checkout: this.dt2,
    price: 1,
    comments: "We're honored to provide you the best service on galaxy!"
  }
  isLoading = false;
  form: FormGroup;
  userId = "";
  userDisplayData = "";
  hotels: Hotel[] = [];
  private hotelSubscription: Subscription;
  private opMode = "create";
  private bookingId = "";  // used to store booking id when in EDIT mode

  constructor(private bookingService: BookingService,  public route: ActivatedRoute, private router: Router, private hotelService: HotelService, private authService: AuthService) {}


  ngOnInit(): void {
    // check if the current logged in user has the required access level for this page
    // effectively, only guests do not have access - authorization should anyways DENY access to this page if not logged in
    if (this.authService.getAuthUserAccLvl() >= 999) {
      this.router.navigate(["/signin"]);
    }
    this.isLoading = true;

    // this is the user that owns this booking
    this.userId = this.authService.getAuthUserId();
    // this is for displaying the user that owns this booking
    this.userDisplayData = this.authService.getAuthUserName() + " (" + this.userId + ")";

    // TODO: get list of all available hotels
    // for demo, fetch 10 hotels only
    this.hotelService.getHotels(10, 1);
    this.hotelSubscription = this.hotelService.getHotelUpdateListener().subscribe((hotelData: { hotels: Hotel[], rc: number }) => {
      this.isLoading = false;
      this.hotels = hotelData.hotels;
    });

    this.form = new FormGroup({
      "hotel_id": new FormControl(this.booking.hotel_id, { validators: [
        Validators.required
      ]}),
      "guest_name": new FormControl(this.booking.guest_name, { validators: [
        Validators.required,
        Validators.minLength(5)
      ]}),
      "guest_email": new FormControl(this.booking.guest_email, { validators: [
        Validators.required,
        Validators.email
      ]}),
      "guest_address": new FormControl(null, { validators: [
        Validators.maxLength(50)
      ]}),
      "guest_phone": new FormControl(this.booking.guest_phone, { validators: [
        Validators.required,
        Validators.maxLength(30)
      ]}),
      "room": new FormControl(this.booking.room, { validators: [
        Validators.required,
        Validators.min(1)
      ]}),
      "persons": new FormControl(this.booking.persons, { validators: [
        Validators.required
      ]}),
      "checkin": new FormControl(this.booking.checkin, { validators: [
        Validators.required
      ]}),
      "checkout": new FormControl(this.booking.checkout, { validators: [
        Validators.required
      ]}),
      "price": new FormControl(this.booking.price, { validators: [
        Validators.required
      ]}),
      "comments": new FormControl(this.booking.comments, { validators: [
        Validators.maxLength(250)
      ]})
    });

    this.route.paramMap.subscribe((pm: ParamMap) => {
      if (pm.has("bookingid")) {
        this.isLoading = true;
        this.opMode = "edit";
        this.bookingId = pm.get("bookingid");
        this.hotelService.getHotelById(this.bookingId).subscribe(bookingData => {
          this.booking = {
            id: bookingData.data._id,
            rv: bookingData.data.rv,
            user_id: bookingData.data.user_id,
            hotel_id: bookingData.data.hotel_id,
            guest_name: bookingData.data.guest_name,
            guest_email: bookingData.data.guest_email,
            guest_address: bookingData.data.guest_address,
            guest_phone: bookingData.data.guest_phone,
            room: bookingData.data.room,
            persons: bookingData.data.persons,
            checkin: bookingData.data.checkin,
            checkout: bookingData.data.checkout,
            price: bookingData.data.price,
            comments: bookingData.data.comments
          };
          this.form.setValue({
            "user_id": this.booking.user_id,
            "hotel_id": this.booking.hotel_id,
            "guest_name": this.booking.guest_name,
            "guest_email": this.booking.guest_email,
            "guest_address": this.booking.guest_address,
            "guest_phone": this.booking.guest_phone,
            "room": this.booking.room,
            "persons": this.booking.persons,
            "checkin": this.booking.checkin,
            "checkout": this.booking.checkout,
            "price": this.booking.price,
            "comments": this.booking.comments
          });

          this.isLoading = false;
        });
      } else {
        this.opMode = "create";
        this.bookingId = "";
      }
    });
  }

  ngOnDestroy(): void {
    this.hotelSubscription.unsubscribe();
  }

  onSaveBooking() {

    if(this.form.invalid) {
      console.log("booking-create-component.onSaveBooking: return from invalid form.");
      return;
    }

    // no need to set it back to false since we will navigate away from the current page
    // and isLoading will be initialized to false
    this.isLoading = true;
    if (this.opMode === "create") {
      const newBooking = {
        id: "",
        rv: 0,
        user_id: this.userId,
        hotel_id: this.form.value.hotel_id,
        guest_name: this.form.value.guest_name,
        guest_email: this.form.value.guest_email,
        guest_address: this.form.value.guest_address,
        guest_phone: this.form.value.guest_phone,
        room: this.form.value.room,
        persons: this.form.value.persons,
        checkin: this.form.value.checkin,
        checkout: this.form.value.checkout,
        price: this.form.value.price,
        comments: this.form.value.comments
      } as Booking;
      console.log("booking-create-component.onSaveBooking.addBooking(" + this.opMode + "): " + JSON.stringify(newBooking));
      // data OK
      this.bookingService.addBooking(newBooking);
    } else if (this.opMode === "edit") {
      const newBooking = {
        id: this.bookingId,
        rv: this.booking.rv,
        user_id: this.form.value.user_id,
        hotel_id: this.form.value.hotel_id,
        guest_name: this.form.value.guest_name,
        guest_email: this.form.value.guest_email,
        guest_address: this.form.value.guest_address,
        guest_phone: this.form.value.guest_phone,
        room: this.form.value.room,
        persons: this.form.value.persons,
        checkin: this.form.value.checkin,
        checkout: this.form.value.checkout,
        price: this.form.value.price,
        comments: this.form.value.comments
      } as Booking;

      console.log("booking-create-component.onSaveBooking.updateBooking(" + this.opMode + "): " + JSON.stringify(newBooking));
      // data OK
      this.bookingService.updateBooking(newBooking);
    }
    // clear the form
    this.form.reset();
  }

}

