import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { getLoggedInUser } from '../helpers/userUtility';

@Injectable({
    providedIn: 'root'
})
export class sellerApproveStatusApproveRouteResolver implements Resolve<any> {
    constructor() { }
    async resolve(): Promise<Observable<any> | Promise<any> | any> {
        const sellerApprovalStatus = get(getLoggedInUser(), 'sellerApprovalStatus', false);
        return sellerApprovalStatus ? false : false;
    }
}
