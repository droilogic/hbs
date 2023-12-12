import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { authAdminGuard } from "./auth/auth.admin.guard";
import { HotelCreateComponent } from "src/app/hotel/hotel-create/hotel-create.component";
import { HotelListComponent } from "src/app/hotel/hotel-list/hotel-list.component";
import { BookingCreateComponent } from "./booking/booking-create/booking-create.component";
import { EmployeeCreateComponent } from "src/app/employee/employee-create/employee-create.component";
import { EmployeeListComponent } from "src/app/employee/employee-list/employee-list.component";
import { SigninComponent } from "./auth/signin/signin.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { UserListComponent } from "./auth/user-list/user-list.component";
import { UserCreateComponent } from "./auth/user-create/user-create.component";

const routes: Routes = [
  { path: 'hotel-list', component: HotelListComponent },
  { path: 'hotel-create', component: HotelCreateComponent, canActivate: [authAdminGuard] },
  { path: 'hotel-edit/:hotelid', component: HotelCreateComponent, canActivate: [authAdminGuard] },
  { path: 'booking-list', component: HotelListComponent, canActivate: [authAdminGuard] },
  { path: 'booking-create', component: BookingCreateComponent, canActivate: [authAdminGuard] },
  { path: 'booking-edit/:bookingid', component: HotelCreateComponent, canActivate: [authAdminGuard] },
  // { path: 'emp-list', component: EmployeeListComponent, canActivate: [authAdminGuard] },
  // { path: 'emp-create', component: EmployeeCreateComponent, canActivate: [authAdminGuard] },
  // { path: 'emp-edit/:empid', component: EmployeeCreateComponent, canActivate: [authAdminGuard] },
  { path: "signin", component: SigninComponent },
  { path: "signup", component: SignupComponent },
  { path: "user-list", component: UserListComponent, canActivate: [authAdminGuard] },
  { path: "user-edit/:userid", component: UserCreateComponent, canActivate: [authAdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
