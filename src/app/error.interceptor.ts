import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, catchError, throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dlg: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let errMsg = "An UNKNOWN ERROR occurred!";
        if (err.error.msgDescr) {
          errMsg = err.error.msgDescr;
        }
        console.log(err);
        this.dlg.open(ErrorComponent, {data: {message: errMsg}});
        return throwError(err);
      })
    );
  }
}