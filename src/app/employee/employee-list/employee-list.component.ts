import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  private employeeSubscription: Subscription;
  employees: Employee[] = [];
  isLoading = false;

  constructor(public employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.employeeService.getEmployees();
    this.employeeSubscription = this.employeeService.getEmployeeUpdateListener().subscribe((employees: Employee[]) => {
      this.isLoading = false;
      this.employees = employees;
    });
  }

  ngOnDestroy(): void {
    this.employeeSubscription.unsubscribe();
  }

  onDelete(empId: string) {
    this.employeeService.deleteEmployee(empId);
  }

}
