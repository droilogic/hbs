import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Hotel } from 'src/app/interfaces/hotel';
import { HotelService } from '../hotel.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit, OnDestroy {
  private hotelSubscription: Subscription;
  hotels: Hotel[] = [];
  isLoading = false;
  userLevel = 5;

  constructor(public hotelService: HotelService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.hotelService.getHotels();
    this.hotelSubscription = this.hotelService.getHotelUpdateListener().subscribe((hotels: Hotel[]) => {
      this.isLoading = false;
      this.hotels = hotels;
    });
  }

  ngOnDestroy(): void {
    this.hotelSubscription.unsubscribe();
  }

  onDelete(hotelId: string) {
    this.hotelService.deleteHotel(hotelId);
  }

}
