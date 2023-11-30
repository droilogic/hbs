import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';


// guard for ADMINS
export const authAdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuth = authService.getAuthStatus();
  const userAccLvl = authService.getAuthUserAccLvl();

  console.log("authAdminGuard#canActivate: " + (isAuth && userAccLvl < 10));

  // check if a user is logged in
  if (isAuth && userAccLvl < 10)
    return true;
  
  // else redirect to our luxury hotel list!
  // must inform user? they accessed a protected page
  // by manually entering the URL!
  return router.parseUrl("/hotel-list");
}
