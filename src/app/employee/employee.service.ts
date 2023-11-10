import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Employee } from 'src/app/interfaces/employee';

@Injectable({ providedIn: 'root'})
export class EmployeeService {
  private employees: Employee[] = [];
  private employeesUpdated = new Subject<Employee[]>();

  constructor (private http: HttpClient) {}

  getEmployees() {
    // no need to unsubscribe; handled by angular itself
    this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>('http://localhost:3333/api/employees')
    .pipe(map((empData) => {
      return empData.data.map(emp => {
        return {
          id: emp._id,
          name: emp.name,
          email: emp.email,
          address: emp.address,
          phone: emp.phone,
          manager_id: emp.manager_id,
          comments: emp.comments
        }
      })
    }))
    .subscribe(empTransformedData => {
      this.employees = empTransformedData;
      this.employeesUpdated.next([...this.employees]);
    });
  }

  getEmployeeUpdateListener() {
    return this.employeesUpdated.asObservable();
  }

  addEmployee(emp: Employee) {
    this.http.post<{
      msgId: string,
      msgDescr: string,
      data: string
    }>('http://localhost:3333/api/employees', emp).subscribe((empData) => {
      console.log(empData.msgDescr);

      // push to local storage on success only
      emp.id = empData.data;
      this.employees.push(emp);
      this.employeesUpdated.next([...this.employees]);
    });
  }

  deleteEmployee(id: string) {
    this.http.delete("http://localhost:3333/api/employees/" + id)
    .subscribe(() => {
      const updEmployees = this.employees.filter(emp => emp.id !== id);
      this.employees = updEmployees;
      this.employeesUpdated.next([...this.employees]);
      console.log("DELETED " + id);
    })
  }



}
