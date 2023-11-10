import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Owner } from 'src/app/interfaces/owner';
import { OwnerService } from '../owner.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit, OnDestroy {
  // owners:Owner[] = [
  //   {"id": 1, "name": "Joh Doe",
  //   "email": "jon@doe.org", "address": "One, Doe Way",
  //   "phone": "666-1234567", "comments": "Don't mess with me" },
  //   {"id": 2, "name": "Bob Squarepants",
  //   "email": "bob@square.org", "address": "One, Square Way",
  //   "phone": "112-1234567", "comments": "Hi there!" },
  //   {"id": 3, "name": "Alice Wonderland",
  //   "email": "alice@wonderland.org", "address": "One, Wonderland Way",
  //   "phone": "112-1234569", "comments": "Alison Hell!" }
  // ];
  private ownerSubscription: Subscription;
  owners:Owner[] = [];

  constructor(public ownerService: OwnerService) {}

  ngOnInit(): void {
    // this will return an empty list upon initialization so it's effectively useless
    this.owners = this.ownerService.getOwners();
    // setup a subscription to owner observable implemented in service
    // use a private variable so it gets destroyed with the component
    // otherwise we will get a nice memory leak
    this.ownerSubscription = this.ownerService.getOwnerUpdateListener().subscribe((owners: Owner[]) => {
      // this is executed every time the subject changes
      this.owners = owners;
    });
  }

  ngOnDestroy(): void {
    // prevent memory leak
    this.ownerSubscription.unsubscribe();
  }
}
