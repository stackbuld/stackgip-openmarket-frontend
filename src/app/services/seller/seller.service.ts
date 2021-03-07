import { Injectable } from '@angular/core';
import { getLoggedInUser } from 'src/app/helpers/userUtility';
import { IUser } from 'src/app/models/IUserModel';
import { ApiAppUrlService } from '../api-app-url.service';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  loggedInUser: IUser = getLoggedInUser();
  baseUrl = "";
  sellerRegisterationFormStatus = {
    approved: 'approved',
    pending: 'pending',
    canceled: 'canceled',
    nully: 'nully',
  }

  constructor(private reqS: RequestService, private apiUrls: ApiAppUrlService) {
    this.baseUrl = this.apiUrls.baseApiUrl;
  }

  registerSeller(data: any) {
    const query = `${ this.baseUrl }users/${ this.loggedInUser.id }/seller`;
    console.log(query);
    return this.reqS.put(query, data);
  }
}
