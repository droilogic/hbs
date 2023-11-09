import { Component } from '@angular/core';
import { Owner } from './interfaces/owner';
import { Manager } from './interfaces/manager';
import { Employee } from './interfaces/employee';
import { Client } from './interfaces/client';
import { Country } from './interfaces/country';
import { Hotel } from './interfaces/hotel';
import { Room } from './interfaces/room';
import { RoomClass } from './interfaces/room_class';
import { Floor } from './interfaces/floor';
import { Booking } from './interfaces/booking';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  ownersMaster:Owner[] = [];

  onOwnerAdded(own:Owner) {
    this.ownersMaster.push(own);
  }
}
