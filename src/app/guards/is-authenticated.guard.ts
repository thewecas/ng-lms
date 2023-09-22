import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/internal/operators/take';
import { AuthService } from '../services/auth/auth.service';

export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkIsAuthenticated().pipe(
    take(1),
    map((res: boolean) => {
      if (!res) {
        return router.createUrlTree(['/login']);
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
