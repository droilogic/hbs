import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Hotel } from 'src/app/interfaces/hotel';

@Injectable({ providedIn: 'root'})
export class HotelService {
  private hotels: Hotel[] = [];
  private hotelsUpdated = new Subject<Hotel[]>();

  constructor (private http: HttpClient, private router: Router) {}

  getHotels() {
    // no need to unsubscribe; handled by angular itself
    this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/hotels")
    .pipe(map((hotelData) => {
      return hotelData.data.map(hotel => {
        return {
          id: hotel._id,
          rv: hotel.rv,
          name: hotel.name,
          email: hotel.email,
          address: hotel.address,
          phone: hotel.phone,
          rooms: hotel.rooms,
          owner_id: hotel.user_id,
          comments: hotel.comments
        }
      })
    }))
    .subscribe(hotelTransformedData => {
      this.hotels = hotelTransformedData;
      this.hotelsUpdated.next([...this.hotels]);
    });
  }

  getHotelById(hotelid: string) {
    return this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/hotels/" + hotelid);
  }

  getHotelUpdateListener() {
    return this.hotelsUpdated.asObservable();
  }

  addHotel(hotel: Hotel, img: File) {
    const hotelData = new FormData();
    hotelData.append("name", hotel.name);
    hotelData.append("email", hotel.email);
    hotelData.append("address", hotel.address);
    hotelData.append("phone", hotel.phone);
    hotelData.append("rooms", "" + hotel.rooms);
    hotelData.append("comments", hotel.comments);
    hotelData.append("image", img, hotel.name);

    console.log(hotelData);

    this.http.post<{
      msgId: string,
      msgDescr: string,
      data: string
    }>("http://localhost:3333/api/hotels", hotelData).subscribe((responseData) => {
      console.log(responseData.msgDescr);

      // push to local storage on success only
      hotel.id = responseData.data;
      this.hotels.push(hotel);
      this.hotelsUpdated.next([...this.hotels]);
      // using angular router to navigate to another page
      this.router.navigate(["/hotel-list"]);
    });
  }

  updateHotel(hotel: Hotel) {
    this.http.put<{
      msgId: string,
      msgDescr: string,
      data: string
    }>("http://localhost:3333/api/hotels/" + hotel.id, hotel).subscribe(hotelData => {
      console.log(hotelData);

      // update local storage on success only
      const updatedHotels = [...this.hotels];
      const oldHotelIdx = updatedHotels.findIndex(h => h.id === hotel.id);
      updatedHotels[oldHotelIdx] = hotel;
      this.hotels = updatedHotels;
      this.hotelsUpdated.next([...this.hotels]);
      this.router.navigate(["/hotel-list"]);
    });
  }

  deleteHotel(id: string) {
    this.http.delete("http://localhost:3333/api/hotels/" + id)
    .subscribe(() => {
      const updHotels = this.hotels.filter(hotel => hotel.id !== id);
      this.hotels = updHotels;
      this.hotelsUpdated.next([...this.hotels]);
      console.log("DELETED " + id);
    })
  }

}
