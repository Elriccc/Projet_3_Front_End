import { CanActivateFn } from '@angular/router';
import { AuthUtil } from './core/util/auth-util'
import { inject } from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {
  const util = inject(AuthUtil)
  return util.isAuthenticated();
};
