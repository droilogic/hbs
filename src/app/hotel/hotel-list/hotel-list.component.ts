import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Hotel } from 'src/app/interfaces/hotel';
import { HotelService } from '../hotel.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit, OnDestroy {
  private hotelSubscription: Subscription;
  hotels: Hotel[] = [];
  totalHotels = 0;
  hotelsPerPage = 3;
  currPage = 1;
  pageSizeOptions = [3, 5, 10];
  isLoading = false;
  userLevel = 5;

  constructor(public hotelService: HotelService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.hotelService.getHotels(this.hotelsPerPage, this.currPage);
    this.hotelSubscription = this.hotelService.getHotelUpdateListener().subscribe((hotelData: { hotels: Hotel[], rc: number }) => {
      this.isLoading = false;
      this.hotels = hotelData.hotels;
      this.totalHotels = hotelData.rc;
    });
  }

  ngOnDestroy(): void {
    this.hotelSubscription.unsubscribe();
  }

  onDelete(hotelId: string) {
    this.hotelService.deleteHotel(hotelId).subscribe(() => {
      this.hotelService.getHotels(this.hotelsPerPage, this.currPage);
    });
  }

  onPageChange(evt: PageEvent) {
    this.isLoading = true;
    // pageIndex is zero based
    this.currPage = evt.pageIndex + 1;
    this.hotelsPerPage = evt.pageSize;
    this.hotelService.getHotels(this.hotelsPerPage, this.currPage);
  }

}
