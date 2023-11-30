import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Hotel } from 'src/app/interfaces/hotel';
import { HotelService } from '../hotel.service';
import { mimeType } from '../mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-hotel-create',
  templateUrl: './hotel-create.component.html',
  styleUrls: ['./hotel-create.component.css']
})
export class HotelCreateComponent implements OnInit {
  hotel:Hotel = { id: "", rv: 0, name: "", img: "", email: "", address: "", phone: "", rooms: 0, owner_id: "", comments: ""};
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private opMode = "create";
  private hotelId = "";  // used to store id when in edit mode

  constructor(public hotelService: HotelService, public route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {

    // check if the current logged in use has the required access level for this page
    if (this.authService.getAuthUserAccLvl() >= 10) {
      this.router.navigate(["/hotel-list"]);
    }

    this.form = new FormGroup({
      "name": new FormControl(null, { validators: [
        Validators.required,
        Validators.minLength(5)
      ]}),
      // image control stays behind the scenes and will not be rendered in form template
      "image": new FormControl(null, { 
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      "email": new FormControl(null, { validators: [
        Validators.required,
        Validators.email
      ]}),
      "address": new FormControl(null, { validators: [
        Validators.maxLength(50)
      ]}),
      "phone": new FormControl(null, { validators: [
        Validators.maxLength(50)
      ]}),
      "rooms": new FormControl(null, { validators: [
        Validators.required,
        Validators.min(1)
      ]}),
      "comments": new FormControl(null, { validators: [
        Validators.maxLength(250)
      ]})
    });

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
            img: hotelData.data.img,
            email: hotelData.data.email,
            address: hotelData.data.address,
            phone: hotelData.data.phone,
            rooms: hotelData.data.rooms,
            owner_id: hotelData.data.owner_id,
            comments: hotelData.data.comments
          };
          this.form.setValue({
            "name": this.hotel.name,
            "image": this.hotel.img,
            "email": this.hotel.email,
            "address": this.hotel.address,
            "phone": this.hotel.phone,
            "rooms": this.hotel.rooms,
            "comments": this.hotel.comments
          });

          this.isLoading = false;
        });
      } else {
        this.opMode = "create";
        this.hotelId = "";
      }
    });
  }

  onPickImage(evt: Event) {
    if ((evt.target as HTMLInputElement).files) {
      const file = (evt.target as HTMLInputElement).files[0];
      // store the file object into image control
      this.form.patchValue({"image": file});
      // recalculate value and validation status of the image control
      this.form.get("image").updateValueAndValidity();
      //console.log("hotel-create-component.onPickImage.evt.target:");
      //console.dir((evt.target as HTMLInputElement));
      //console.log("hotel-create-component.onPickImage.evt.target.files[0]:");
      //console.dir((evt.target as HTMLInputElement).files[0]);
  
      // read the byte stream and convert it to base64 data
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveHotel() {

    if(this.form.invalid) {
      console.log("hotel-create-component.onSaveHotel: return from invalid form.");
      return;
    }

    // no need to set it back to false since we will navigate away from the current page
    // and isLoading will be initialized to false
    this.isLoading = true;
    if (this.opMode === "create") {
      const newHotel = { id: "", rv: 0, name: this.form.value.name, img: "",
      email: this.form.value.email, address: this.form.value.address,
      phone: this.form.value.phone, rooms: this.form.value.rooms, owner_id: "",
      comments: this.form.value.comments };
      this.hotelService.addHotel(newHotel, this.form.value.image);
    } else if (this.opMode === "edit") {
      const newHotel = { id: this.hotelId, rv: this.hotel.rv , name: this.form.value.name, img: "",
      email: this.form.value.email, address: this.form.value.address,
      phone: this.form.value.phone, rooms: this.form.value.rooms, owner_id: "",
      comments: this.form.value.comments };

      console.log("hotel-create-component.onSaveHotel.newHotel(" + this.opMode + "): " + JSON.stringify(newHotel));
      
      this.hotelService.updateHotel(newHotel, this.form.value.image);
    }
    // clear the form
    this.form.reset();
  }
}
