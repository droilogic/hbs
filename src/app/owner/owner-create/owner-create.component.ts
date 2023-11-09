import { Component, EventEmitter, Output } from '@angular/core';
import { Owner } from 'src/app/interfaces/owner';

@Component({
  selector: 'app-owner-create',
  templateUrl: './owner-create.component.html',
  styleUrls: ['./owner-create.component.css']
})
export class OwnerCreateComponent {
  newOwnerComment = 'type in a comment';
  dtoOwnerId = 0;
  dtoOwnerFullname = '';
  dtoOwnerEmail = '';
  dtoOwnerAddress = '';
  dtoOwnerPhone = '';
  dtoOwnerComment = '';
  owner:Owner | undefined;

  @Output() ownerCreated = new EventEmitter();

  onCreateOwner() {

    this.dtoOwnerId++;
    const newOwner = {"id": this.dtoOwnerId, "name": this.dtoOwnerFullname,
       "email": this.dtoOwnerEmail, "address": this.dtoOwnerAddress,
       "phone": this.dtoOwnerPhone, "comments": this.dtoOwnerComment };
    this.ownerCreated.emit(newOwner);
  }
}
