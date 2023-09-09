import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { last, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkIsAuthenticated()
    .pipe(
      last(),
      tap(res => {
        if (!res) {
          return router.navigate(['/login']);
        }
        return true;
      }));
};
