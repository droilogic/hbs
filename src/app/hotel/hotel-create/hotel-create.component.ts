import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Hotel } from 'src/app/interfaces/hotel';
import { HotelService } from '../hotel.service';


@Component({
  selector: 'app-hotel-create',
  templateUrl: './hotel-create.component.html',
  styleUrls: ['./hotel-create.component.css']
})
export class HotelCreateComponent implements OnInit {
  hotel:Hotel = { id: "", rv: 0, name: "", email: "", address: "", phone: "", rooms: 0, owner_id: "", comments: ""};
  isLoading = false;
  private opMode = "create";
  private hotelId = "";  // used to store id when in edit mode

  constructor(public hotelService: HotelService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm: ParamMap) => {
      if (pm.has("hotelid")) {
        this.isLoading = true;
        this.opMode = "edit";
        this.hotelId = pm.get("hotelid");
        this.hotelService.getHotelById(this.hotelId).subscribe(hotelData => {
          this.hotel = {
            id: hotelData.data._id,
            rv: hotelData.data.rv,
            name: hotelData.data.name,
            email: hotelData.data.email,
            address: hotelData.data.address,
            phone: hotelData.data.phone,
            rooms: hotelData.data.rooms,
            owner_id: hotelData.data.owner_id,
            comments: hotelData.data.comments
          }
          this.isLoading = false;
        });
      } else {
        this.opMode = "create";
        this.hotelId = "";
      }
    });
  }

  onSaveHotel(form: NgForm) {

    if(form.invalid) {
      return;
    }

    // no need to set it back to false since we will navigate away from the current page
    // and isLoading will be initialized to false
    this.isLoading = true;
    if (this.opMode === "create") {
      const newHotel = {id: "", rv: 0, name: form.value.name,
      email: form.value.email, address: form.value.address,
      phone: form.value.phone, rooms: form.value.rooms, owner_id: "",
      comments: form.value.comments };
      this.hotelService.addHotel(newHotel);
    } else if (this.opMode === "edit") {
      const newHotel = {id: this.hotelId, rv: form.value.rv , name: form.value.name,
      email: form.value.email, address: form.value.address,
      phone: form.value.phone, rooms: form.value.rooms, owner_id: "",
      comments: form.value.comments };
      
      this.hotelService.updateHotel(newHotel);
    }
    // clear the form
    form.resetForm();
  }
}
