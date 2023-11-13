import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { EmployeeCreateComponent } from "src/app/employee/employee-create/employee-create.component";
import { EmployeeListComponent } from "src/app/employee/employee-list/employee-list.component";

const routes: Routes = [
  { path: 'emp-list', component: EmployeeListComponent },
  { path: 'emp-create', component: EmployeeCreateComponent },
  { path: 'emp-edit/:empid', component: EmployeeCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}