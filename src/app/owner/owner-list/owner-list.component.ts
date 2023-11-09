import { Component, Input } from '@angular/core';
import { Owner } from 'src/app/interfaces/owner';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent {
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
  @Input() owners:Owner[] = [];
}
