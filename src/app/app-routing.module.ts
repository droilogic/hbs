import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { EmployeeCreateComponent } from "src/app/employee/employee-create/employee-create.component";
import { EmployeeListComponent } from "src/app/employee/employee-list/employee-list.component";
import { HotelCreateComponent } from "src/app/hotel/hotel-create/hotel-create.component";
import { HotelListComponent } from "src/app/hotel/hotel-list/hotel-list.component";

const routes: Routes = [
  { path: 'hotel-list', component: HotelListComponent },
  { path: 'hotel-create', component: HotelCreateComponent },
  { path: 'hotel-edit/:hotelid', component: HotelCreateComponent },
  { path: 'emp-list', component: EmployeeListComponent },
  { path: 'emp-create', component: EmployeeCreateComponent },
  { path: 'emp-edit/:empid', component: EmployeeCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
