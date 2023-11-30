import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';


// guard for AUTHENTICATED only
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.getAuthStatus();

  console.log("authGuard#canActivate: " + isAuth);

  // check if a user is logged in
  if (isAuth)
    return isAuth;
  
  // else redirect to login page
  return router.parseUrl("/signin");
}
