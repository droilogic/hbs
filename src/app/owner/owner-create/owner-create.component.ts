import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Owner } from 'src/app/interfaces/owner';
import { OwnerService } from '../owner.service';

@Component({
  selector: 'app-owner-create',
  templateUrl: './owner-create.component.html',
  styleUrls: ['./owner-create.component.css']
})
export class OwnerCreateComponent {
  dtoOwner: Owner = { id: 0, name: "", email: "", address: "", phone: "", comments: ""};
  newOwnerComment = 'type in a comment';
  ownerId = 0;
  owner:Owner | undefined;

  constructor(public ownerService: OwnerService) {}

  onCreateOwner(form: NgForm) {

    if(form.invalid) {
      return;
    }

    this.ownerId++;
    const newOwner = {id: this.ownerId, name: form.value.fullname,
       email: form.value.email, address: form.value.address,
       phone: form.value.phone, comments: form.value.comments };
    this.ownerService.addOwner(newOwner);
    // clear the form
    form.resetForm();
  }
}
