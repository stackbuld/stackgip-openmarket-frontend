import { ProductsService } from '../services/products/products.service';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';


export const homeRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const windowRef = inject(DOCUMENT).defaultView;
  windowRef.open(`${environment.seoDomain}`, '_self');
  return false;
};

export const singleProductRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const productService = inject(ProductsService);
  const productId = route.paramMap.get('id');
  const windowRef = inject(DOCUMENT).defaultView;

  productService.getCachedProductById(productId).subscribe({
    next: (res) => {
      if (res) {
        windowRef.open(
          `${environment.seoDomain}/product/${res.data.slug}`,
          '_self'
        );
      }
    },
  });
  return false;
};

export const sellerStoreRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const sellerId = route.params['sellerId'];
  const windowRef = inject(DOCUMENT).defaultView;
  if (sellerId) {
    windowRef.open(`${environment.seoDomain}/seller/${sellerId}`, '_self');
  }
  return false;
};

export const cartRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const windowRef = inject(DOCUMENT).defaultView;
  windowRef.open(`${environment.seoDomain}/cart`, '_self');
  return false;
};

export const learnMoreRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const windowRef = inject(DOCUMENT).defaultView;
  windowRef.open(`${environment.seoDomain}/learn`, '_self');
  return false;
};

export const sellerFormRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const windowRef = inject(DOCUMENT).defaultView;
  windowRef.open(`${environment.seoDomain}/seller-form`, '_self');
  return false;
};
