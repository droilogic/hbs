import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { EmployeeCreateComponent } from "src/app/employee/employee-create/employee-create.component";
import { EmployeeListComponent } from "src/app/employee/employee-list/employee-list.component";
import { HotelCreateComponent } from "src/app/hotel/hotel-create/hotel-create.component";
import { HotelListComponent } from "src/app/hotel/hotel-list/hotel-list.component";
import { SigninComponent } from "./auth/signin/signin.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { authGuard } from "./auth/auth.guard";
import { authAdminGuard } from "./auth/auth.admin.guard";

const routes: Routes = [
  { path: 'hotel-list', component: HotelListComponent },
  { path: 'hotel-create', component: HotelCreateComponent, canActivate: [authAdminGuard] },
  { path: 'hotel-edit/:hotelid', component: HotelCreateComponent, canActivate: [authAdminGuard] },
  { path: 'emp-list', component: EmployeeListComponent, canActivate: [authAdminGuard] },
  { path: 'emp-create', component: EmployeeCreateComponent, canActivate: [authAdminGuard] },
  { path: 'emp-edit/:empid', component: EmployeeCreateComponent, canActivate: [authAdminGuard] },
  { path: "signin", component: SigninComponent },
  { path: "signup", component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
