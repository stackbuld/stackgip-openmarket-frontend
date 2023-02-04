import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { SellerService } from '../services/seller/seller.service';

@Injectable({
  providedIn: 'root',
})
export class sellerApproveStatusApproveRouteResolver implements Resolve<any> {
  constructor(
    private sellerS: SellerService,
    private authService: AuthService
  ) {}
  async resolve(): Promise<Observable<any> | Promise<any> | any> {
    const sellerApprovalStatus = get(
      this.authService.getLoggedInUser(),
      'sellerApprovalStatus',
      null
    );
    return this.switchState(sellerApprovalStatus);
  }
  switchState(switchData: any) {
    //states ::::: approve, pending, canceled, null, ""
    if (switchData === 'approved') {
      return this.sellerS.sellerRegisterationFormStatus.approved;
    } else if (switchData === 'pending') {
      return this.sellerS.sellerRegisterationFormStatus.pending;
    } else {
      return this.sellerS.sellerRegisterationFormStatus.nully;
    }
  }
}
