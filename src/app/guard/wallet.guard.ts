import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { IUser } from '../models/IUserModel';

@Injectable({
  providedIn: 'root',
})
export class WalletGuard implements CanActivate {
  user: IUser;
  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getLoggedInUser();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.user) return this.router.createUrlTree(['/']);
    if (
      (!this.user.isNINAdded || !this.user.isKycVerified) &&
      this.user.sellerApprovalStatus == 'approved'
    ) {
      return this.router.createUrlTree(['/seller/wallet']);
    }
    if (
      this.user.sellerApprovalStatus == 'pending' ||
      this.user.sellerApprovalStatus == 'pendingKycReview'
    ) {
      return this.router.createUrlTree(['/seller/wallet']);
    }
    return this.user.sellerApprovalStatus == 'approved'
      ? this.router.createUrlTree(['/seller/wallet'])
      : true;
  }
}
