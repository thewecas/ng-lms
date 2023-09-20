import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { last, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkIsAuthenticated().pipe(
    last(),
    tap((res) => {
      if (!res) {
        return router.navigate(['/login']);
      }
      return true;
    })
  );

  /*  return new Observable((subscriber: any) => {
    authService.isAuthenticated$.pipe(take(1)).subscribe((res) => {
      if (!res) {
        subscriber.next(router.navigate(['/login']));
      }
      subscriber.next(true);
    });
  }); */
};
