import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { Booking } from '../../interfaces/booking';
import { BookingService } from '../booking.service';
import { Hotel } from '../../interfaces/hotel';
import { HotelService } from '../../hotel/hotel.service';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  bookings_alt = [];
  totalBookings = 0;
  bookingsPerPage = 2;
  currPage = 1;
  pageSizeOptions = [2, 3, 5];
  isLoading = false;
  userAuthenticated = false;
  userLevel = 999;
  userId = "";
  userName = "";
  hotels: Hotel[] = [];
  private bookingSubscription: Subscription;
  private hotelSubscription: Subscription;
  private authStatusSubscription: Subscription;

  constructor(private bookingService: BookingService, private hotelService: HotelService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;

    // this is required to properly reflect authentication status
    // when accessing this page for the first time
    // (before subscribing to AuthStatusListener)
    // this.userAuthenticated = this.authService.getAuthStatus();
    // this.userLevel = this.authService.getAuthUserAccLvl();
    // this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(isAuth => {
    //   this.userAuthenticated = isAuth;
    //   this.userId = this.authService.getAuthUserId();
    //   this.userName = this.authService.getAuthUserName();
    //   this.userLevel = this.authService.getAuthUserAccLvl();
    // });

    // TODO: get list of all available hotels
    // for demo, fetch 10 hotels only
    this.hotelService.getHotels(10, 1);
    this.hotelSubscription = this.hotelService.getHotelUpdateListener().subscribe((hotelData: { hotels: Hotel[], rc: number }) => {
      this.hotels = hotelData.hotels;
      // console.log("booking-list-component.ngOnInit> hotels: " + JSON.stringify(this.hotels));
      // console.log("booking-list-component.ngOnInit> hotel[655c6677a50fccbf41c7c8a8]: " + JSON.stringify(this.hotels.filter(hotel => { return hotel.id == "655c6677a50fccbf41c7c8a8" })));
    });

    this.bookingService.getBookings(this.bookingsPerPage, this.currPage);
    this.bookingSubscription = this.bookingService.getBookingUpdateListener().subscribe((bookingData: { bookings: Booking[], rc: number }) => {
      this.isLoading = false;
      this.bookings = bookingData.bookings;
      this.totalBookings = bookingData.rc;

      this.bookings_alt = [...this.bookings];

      this.userAuthenticated = this.authService.getAuthStatus();
      this.userId = this.authService.getAuthUserId();
      this.userName = this.authService.getAuthUserName();
      this.userLevel = this.authService.getAuthUserAccLvl();

      this.bookings_alt.forEach((item, idx, obj) => {
        const objHotel2 = this.hotels.find(o => o.id == item.hotel_id);
        obj[idx]["hotel_name"] = objHotel2.name;
      });

    });
}

  ngOnDestroy(): void {
    this.bookingSubscription.unsubscribe();
    this.hotelSubscription.unsubscribe();
    // this.authStatusSubscription.unsubscribe();
  }

  onDelete(bookingId: string) {
    this.bookingService.deleteBooking(bookingId).subscribe(() => {
      this.bookingService.getBookings(this.bookingsPerPage, this.currPage);
    });
  }

  onPageChange(evt: PageEvent) {
    this.isLoading = true;
    // pageIndex is zero based
    this.currPage = evt.pageIndex + 1;
    this.bookingsPerPage = evt.pageSize;
    this.bookingService.getBookings(this.bookingsPerPage, this.currPage);
  }

}
