import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Employee } from 'src/app/interfaces/employee';

@Injectable({ providedIn: 'root'})
export class EmployeeService {
  private employees: Employee[] = [];
  private employeesUpdated = new Subject<Employee[]>();

  constructor (private http: HttpClient, private router: Router) {}

  getEmployees() {
    // no need to unsubscribe; handled by angular itself
    this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/employees")
    .pipe(map((empData) => {
      return empData.data.map(emp => {
        return {
          id: emp._id,
          rv: emp.rv,
          name: emp.name,
          email: emp.email,
          address: emp.address,
          phone: emp.phone,
          user_id: emp.user_id,
          comments: emp.comments
        }
      })
    }))
    .subscribe(empTransformedData => {
      this.employees = empTransformedData;
      this.employeesUpdated.next([...this.employees]);
    });
  }

  getEmployeeById(empid: string) {
    // return {...this.employees.find(emp => emp.id === empid) }
    return this.http.get<{
      msgId: string,
      msgDescr: string,
      data: any
    }>("http://localhost:3333/api/employees/" + empid);
  }

  getEmployeeUpdateListener() {
    return this.employeesUpdated.asObservable();
  }

  addEmployee(emp: Employee) {
    this.http.post<{
      msgId: string,
      msgDescr: string,
      data: string
    }>("http://localhost:3333/api/employees", emp).subscribe((empData) => {
      console.log(empData.msgDescr);

      // push to local storage on success only
      emp.id = empData.data;
      this.employees.push(emp);
      this.employeesUpdated.next([...this.employees]);
      // using angular router to navigate to another page
      this.router.navigate(["/emp-list"]);
    });
  }

  updateEmployee(emp: Employee) {
    this.http.put<{
      msgId: string,
      msgDescr: string,
      data: string
    }>("http://localhost:3333/api/employees/" + emp.id, emp).subscribe(empData => {
      console.log(empData);

      // update local storage on success only
      const updatedEmployees = [...this.employees];
      const oldEmployeeIdx = updatedEmployees.findIndex(e => e.id === emp.id);
      updatedEmployees[oldEmployeeIdx] = emp;
      this.employees = updatedEmployees;
      this.employeesUpdated.next([...this.employees]);
      this.router.navigate(["/emp-list"]);
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
