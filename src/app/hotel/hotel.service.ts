import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Hotel } from 'src/app/interfaces/hotel';

@Injectable({ providedIn: 'root'})
export class HotelService {
  private hotels: Hotel[] = [];
  private hotelsUpdated = new Subject<{ hotels: Hotel[], rc: number }>();

  constructor (private http: HttpClient, private router: Router) {}

  getHotels(itemsPerPage: number, currPage: number) {
    const qParams = `?ps=${itemsPerPage}&pg=${currPage}`;
    // no need to unsubscribe; handled by angular itself
    this.http.get<{
      msgId: string,
      msgDescr: string,
      cnt: number,
      data: any
    }>("http://localhost:3333/api/hotels" + qParams)
    .pipe(map((hotelData) => {
      return {
        hotels: hotelData.data.map(hotel => {
          return {
            id: hotel._id,
            rv: hotel.rv,
            name: hotel.name,
            img: hotel.img,
            email: hotel.email,
            address: hotel.address,
            phone: hotel.phone,
            rooms: hotel.rooms,
            owner_id: hotel.user_id,
            comments: hotel.comments
          }
        }),
        rc: hotelData.cnt
      }
    }))
    .subscribe(hotelTransformedData => {
      this.hotels = hotelTransformedData.hotels;
      this.hotelsUpdated.next({ hotels: [...this.hotels], rc: hotelTransformedData.rc });
    });
  }

  getHotelById(hotelid: string) {
    return this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/hotels/" + hotelid);
  }

  getHotelNameById(hotelid: string) {

    const hotel = this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/hotels/" + hotelid);
    return hotel;
  }

  getHotelUpdateListener() {
    return this.hotelsUpdated.asObservable();
  }

  addHotel(hotel: Hotel, img: File) {
    console.log("HotelService.addHotel.hotel: " + JSON.stringify(hotel));
    // data OK
    const hotelData = new FormData();
    hotelData.append("name", hotel.name);
    hotelData.append("email", hotel.email);
    hotelData.append("address", hotel.address);
    hotelData.append("phone", hotel.phone);
    hotelData.append("rooms", "" + hotel.rooms);
    hotelData.append("comments", hotel.comments);
    hotelData.append("image", img, hotel.name);

    console.log("HotelService.addHotel.hotelData: " + JSON.stringify(hotelData));

    this.http.post<{
      msgId: string,
      msgDescr: string,
      data: Hotel
    }>("http://localhost:3333/api/hotels", hotelData).subscribe((responseData) => {
      // using angular router to navigate to another page
      this.router.navigate(["/hotel-list"]);
    });
  }

  updateHotel(hotel: Hotel, image: File | string) {
    let hotelData: Hotel | FormData;

    // check type of image param
    if(typeof(image) === 'object') {
      //console.log("hotel.service.updateHotel: received File object");
      hotelData = new FormData();
      hotelData.append("id", hotel.id);
      hotelData.append("rv", hotel.rv.toString());
      hotelData.append("name", hotel.name);
      hotelData.append("email", hotel.email);
      hotelData.append("address", hotel.address);
      hotelData.append("phone", hotel.phone);
      hotelData.append("rooms", "" + hotel.rooms);
      hotelData.append("comments", hotel.comments);
      hotelData.append("image", image, hotel.name);
    } else {
      //console.log("hotel.service.updateHotel: received string");
      hotelData = {
        id: hotel.id,
        rv: hotel.rv,
        name: hotel.name,
        img: image,
        email: hotel.email,
        address: hotel.address,
        phone: hotel.phone,
        owner_id: "",
        comments: hotel.comments
      } as Hotel;
    }

    console.log("HotelService.updateHotel.hotelData:");
    console.dir(hotelData);

    this.http.put<{
      msgId: string,
      msgDescr: string,
      data: string
    }>("http://localhost:3333/api/hotels/" + hotel.id, hotelData).subscribe(hotelData => {
      // using angular router to navigate to another page
      this.router.navigate(["/hotel-list"]);
    });
  }

  deleteHotel(id: string) {
    return this.http.delete("http://localhost:3333/api/hotels/" + id);
  }

}
