import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})

export class EmployeeCreateComponent implements OnInit {
  dtoEmployee: Employee = { id: "", name: "", email: "", address: "", phone: "", manager_id: 0, comments: ""};

  employee:Employee = { id: "", name: "", email: "", address: "", phone: "", manager_id: 0, comments: ""};
  isLoading = false;
  private opMode = "create";
  private employeeId = "";  // used to store id when in edit mode

  constructor(public employeeService: EmployeeService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((pm: ParamMap) => {
      if (pm.has("empid")) {
        this.isLoading = true;
        this.opMode = "edit";
        this.employeeId = pm.get("empid");
        this.employeeService.getEmployeeById(this.employeeId).subscribe(empData => {
          this.employee = {
            id: empData.data._id,
            name: empData.data.name,
            email: empData.data.email,
            address: empData.data.address,
            phone: empData.data.phone,
            manager_id: empData.data.manager_id,
            comments: empData.data.comments
          }
          this.isLoading = false;
        });
      } else {
        this.opMode = "create";
        this.employeeId = "";
      }
    });
  }

  onSaveEmployee(form: NgForm) {

    if(form.invalid) {
      return;
    }

    // no need to set it back to false since we will navigate away from the current page
    // and isLoading will be initialized to false
    this.isLoading = true;
    if (this.opMode === "create") {
      const newEmployee = {id: "", name: form.value.name,
      email: form.value.email, address: form.value.address,
      phone: form.value.phone, manager_id: form.value.manager,
      comments: form.value.comments };
      this.employeeService.addEmployee(newEmployee);
    } else if (this.opMode === "edit") {
      const newEmployee = {id: this.employeeId, name: form.value.name,
      email: form.value.email, address: form.value.address,
      phone: form.value.phone, manager_id: form.value.manager,
      comments: form.value.comments };
      
      this.employeeService.updateEmployee(newEmployee);
    }
    // clear the form
    form.resetForm();
  }
}
