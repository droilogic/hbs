import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})

export class EmployeeCreateComponent {
  dtoEmployee: Employee = { id: "", name: "", email: "", address: "", phone: "", manager_id: 0, comments: ""};
  employeeId = 3; // we already have 3 dummy entries on local storage
  employee:Employee | undefined;

  constructor(public employeeService: EmployeeService) {}

  onCreateEmployee(form: NgForm) {

    if(form.invalid) {
      return;
    }

    this.employeeId++;
    const newEmployee = {id: "", name: form.value.name,
       email: form.value.email, address: form.value.address,
       phone: form.value.phone, manager_id: form.value.manager,
       comments: form.value.comments };
    this.employeeService.addEmployee(newEmployee);
    // clear the form
    form.resetForm();
  }
}
