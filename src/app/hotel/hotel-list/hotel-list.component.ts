import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Hotel } from 'src/app/interfaces/hotel';
import { HotelService } from '../hotel.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  totalHotels = 0;
  hotelsPerPage = 2;
  currPage = 1;
  pageSizeOptions = [2, 3, 5];
  isLoading = false;
  userAuthenticated = false;
  userLevel = 999;
  private hotelSubscription: Subscription;
  private authStatusSubscription: Subscription;


  constructor(public hotelService: HotelService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.hotelService.getHotels(this.hotelsPerPage, this.currPage);
    this.hotelSubscription = this.hotelService.getHotelUpdateListener().subscribe((hotelData: { hotels: Hotel[], rc: number }) => {
      this.isLoading = false;
      this.hotels = hotelData.hotels;
      this.totalHotels = hotelData.rc;
    });
    // this is required to properly reflect authentication status
    // when accessing this page for the first time
    // (before subscribing to AuthStatusListener)
    this.userAuthenticated = this.authService.getAuthStatus();
    this.userLevel = this.authService.getAuthUserAccLvl();
    this.authStatusSubscription = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.userAuthenticated = isAuth;
      this.userLevel = this.authService.getAuthUserAccLvl();
    });
  }

  ngOnDestroy(): void {
    this.hotelSubscription.unsubscribe();
    this.authStatusSubscription.unsubscribe();
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
