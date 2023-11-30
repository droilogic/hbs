import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor (private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // get authorization token (if any)
    const authToken = this.authService.getAuthToken();
    // clone incoming request (WARNING: this is mandatory; original req must be untouched)
    const authReq = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });

    return next.handle(authReq);
  }
}