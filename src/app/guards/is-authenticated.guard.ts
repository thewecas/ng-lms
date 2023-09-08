import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { last, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  /*  return authService.checkIsAuthenticated().pipe(last(), tap(res => {
     if (!res) {
       console.log("Not authenticated");
       return router.navigate(['/login']);
     }
     console.log("Authenticated User");
 
     return true;
   })); */
  return authService.checkIsAuthenticated()
    .pipe(
      last(),
      tap(res => {
        console.log("User-->", authService.currentUser);

        if (!res) {
          return router.navigate(['/login']);
        }

        return true;
      }));
};
