import { WindowRefService } from './../shared/services/window.service';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
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
    let isLogin: boolean;
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
