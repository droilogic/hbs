import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Booking } from 'src/app/interfaces/booking';

@Injectable({ providedIn: 'root'})
export class BookingService {
  private bookings: Booking[] = [];
  private bookingsUpdated = new Subject<{ bookings: Booking[], rc: number }>();

  constructor (private http: HttpClient, private router: Router) {}

  getBookings(itemsPerPage: number, currPage: number) {
    const qParams = `?ps=${itemsPerPage}&pg=${currPage}`;
    // no need to unsubscribe; handled by angular itself
    this.http.get<{
      msgId: string,
      msgDescr: string,
      cnt: number,
      data: any
    }>("http://localhost:3333/api/bookings" + qParams)
    .pipe(map((bookingData) => {
      return {
        bookings: bookingData.data.map(booking => {
          return {
            id: booking._id,
            rv: booking.rv,
            user_id: booking.user_id,
            hotel_id: booking.hotel_id,
            guest_name: booking.guest_name,
            guest_email: booking.guest_email,
            guest_address: booking.guest_address,
            guest_phone: booking.guest_phone,
            room: booking.room,
            persons: booking.persons,
            checkin: booking.checkin,
            checkout: booking.checkout,
            price: booking.price,
            comments: booking.comments
          }
        }),
        rc: bookingData.cnt
      }
    }))
    .subscribe(bookingTransformedData => {
      this.bookings = bookingTransformedData.bookings;
      this.bookingsUpdated.next({ bookings: [...this.bookings], rc: bookingTransformedData.rc });
    });
  }

  getBookingById(bookingid: string) {
    return this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/bookings/" + bookingid);
  }

  getBookingUpdateListener() {
    return this.bookingsUpdated.asObservable();
  }

  addBooking(booking: Booking) {
    console.log("BookingService.addBooking.booking: " + JSON.stringify(booking));
    // data OK
    // const bookingData = new FormData();
    // bookingData.append("user_id", booking.user_id);
    // bookingData.append("hotel_id", booking.hotel_id);
    // bookingData.append("guest_name", booking.guest_name);
    // bookingData.append("guest_email", booking.guest_email);
    // bookingData.append("guest_address", booking.guest_address);
    // bookingData.append("guest_phone", booking.guest_phone);
    // bookingData.append("room", "" + booking.room);
    // bookingData.append("persons", "" + booking.persons);
    // bookingData.append("checkin", "" + booking.checkin);
    // bookingData.append("checkout", "" + booking.checkout);
    // bookingData.append("price", "" + booking.price);
    // bookingData.append("comments", booking.comments);

    const newBooking = {
      id: "",
      rv: 0,
      user_id: booking.user_id,
      hotel_id: booking.hotel_id,
      guest_name: booking.guest_name,
      guest_email: booking.guest_email,
      guest_address: booking.guest_address,
      guest_phone: booking.guest_phone,
      room: booking.room,
      persons: booking.persons,
      checkin: booking.checkin,
      checkout: booking.checkout,
      price: booking.price,
      comments: booking.comments
    } as Booking;


    // log formdata
    // let bkData = "[";
    // bookingData.forEach((val, key) => {
    //   bkData += "(" + key + ', ' + val + ") ";
    // });
    // bkData += "]";
    // console.log("BookingService.addBooking.bookingData: " + bkData);
    // data OK

    this.http.post<{
      msgId: string,
      msgDescr: string,
      data: Booking
    }>("http://localhost:3333/api/bookings", newBooking).subscribe((responseData) => {
      // using angular router to navigate to another page
      this.router.navigate(["/booking-list"]);
    });
  }

  updateBooking(booking: Booking) {
    const bookingData = {
        id: booking.id,
        rv: booking.rv,
        user_id: booking.user_id,
        hotel_id: booking.hotel_id,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        guest_address: booking.guest_address,
        guest_phone: booking.guest_phone,
        room: booking.room,
        persons: booking.persons,
        price: booking.price,
        comments: booking.comments
      } as Booking;

    console.log("BookingService.updateBooking.bookingData:");
    console.dir(bookingData);

    this.http.put<{
      msgId: string,
      msgDescr: string,
      data: string
    }>("http://localhost:3333/api/bookings/" + booking.id, bookingData).subscribe(hotelData => {
      // using angular router to navigate to another page
      this.router.navigate(["/booking-list"]);
    });
  }

  deleteBooking(id: string) {
    return this.http.delete("http://localhost:3333/api/bookings/" + id);
  }

}
