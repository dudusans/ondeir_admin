import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { LoginResultEntity } from '../../../../../ondeir_admin_shared/models/auth/loginResult.model';

@Injectable()
export class TicketGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    if (this.loginInfo) {
      if (this.loginInfo.type >= 2) {
        this.router.navigate(['/tickets/events']);
        return false;
      }

      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  public get loginInfo(): LoginResultEntity {
    return JSON.parse(
      localStorage.getItem("authUser")
    );
  }
}
