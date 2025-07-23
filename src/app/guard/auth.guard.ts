import { WindowRefService } from './../shared/services/window.service';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  private router = inject(Router);
  constructor(private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let isLogin: boolean = false;
    const signInData = this.authService.GetSignInData();
    if (signInData) {
      isLogin = signInData.canLogin;
    }
    if (!isLogin) {
      this.router.navigate(['/auth/login']);
    }
    return isLogin;
  }
}
