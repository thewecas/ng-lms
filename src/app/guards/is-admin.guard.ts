import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if ((authService.currentUser?.role ?? 'employee') == 'admin')
    return true;
  else
    return false;

};
