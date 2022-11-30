import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getLoggedInUser } from 'src/app/helpers/userUtility';
import { IUser } from 'src/app/models/IUserModel';
import { GetSeller, ISeller } from 'src/app/models/sellerModel';
import { ResponseModel } from 'src/app/shared/models/ResponseModel';
import { ApiAppUrlService } from '../api-app-url.service';
import { RequestService } from '../request/request.service';


import { HttpClient } from "@angular/common/http";
import { AuthService } from '../auth.service';

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
  };

  constructor(private reqS: RequestService, private apiUrls: ApiAppUrlService,private http: HttpClient) {
    this.baseUrl = this.apiUrls.baseApiUrl;
  }

  

  registerSeller(data: ISeller) {
    // const query = `${ this.baseUrl }users/${ this.loggedInUser.id }/seller`;
    const query = `${ this.baseUrl }sellers/verification`;
    return this.reqS.post<ResponseModel>(query, data)
      .pipe(
        switchMap((val) => {
          return this.updateUserSellerDetails(val, data);
        }),
      );
  }
  updateUserSellerDetails(val: ResponseModel, data: ISeller): Observable<any> {
    const loggedInUser = getLoggedInUser();
    const newData = {
      ...loggedInUser,
      ...data,
      sellerApprovalStatus: this.sellerRegisterationFormStatus.pending,
    };
    localStorage.setItem("user", JSON.stringify(newData));
    return of({
      user: {
        ...newData,
      },
      response: {
        ...val
      }
    });
  }
  getSellerById(id: string): Observable<GetSeller> {
    return this.http.get<GetSeller>(
      this.baseUrl + `users/${id}`
    );
  }
}
