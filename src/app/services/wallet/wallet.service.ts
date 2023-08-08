import { IResponseModel } from "./../../shared/models/IResponseModel";
import { IBankAccount, IWalletResponse } from "../../models/wallet.model"
import { BehaviorSubject, Observable } from "rxjs";
import { IUpdateUser, IUserResponse } from "./../../models/IUserModel";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiAppUrlService } from "../api-app-url.service";

@Injectable({
  providedIn: "root",
})
export class WalletService {
  baseUrl: string;
  private userWalletData = new BehaviorSubject([])


  getWalletInfo = this.userWalletData.asObservable();
    constructor(private api: ApiAppUrlService, private http: HttpClient) {
       this.baseUrl = api.walletBaseUrl;
  }

//   updateUser(userInfo: IUpdateUser): Observable<IResponseModel> {
//     return this.http.put<IResponseModel>(
//       this.api.baseApiUrl + "users",
//       userInfo
//     );
//   }

  getWallet(): Observable<IWalletResponse> {
      console.log("Pre-api part")
    return this.http.get<IWalletResponse>(this.baseUrl + `wallet/user`);
  }
  
  getBanks(): Observable<IWalletResponse> {
    return this.http.get<IWalletResponse>(this.baseUrl + `bankaccount/banks/NGN`);
  }
  
   getTransactions(): Observable<IWalletResponse> {
    return this.http.get<IWalletResponse>(this.baseUrl + `payments/transactions`);
  }
  
  getAccountName(body): Observable<any> {
    return this.http.post<any>(this.baseUrl + `bankaccount/banks/validate-account`, body);
    }
    
      getBankAccounts(): Observable<IBankAccount> {
    return this.http.get<IBankAccount>(this.baseUrl + `bankaccount/user`);
      }
  
   sendOtp(): Observable<any> {
    return this.http.post<any>(this.baseUrl + `wallet/withdrawal-request-otp`, null);
   }
  
  addToAccountsLists(body): Observable<any> {
    return this.http.post<any>(this.baseUrl + `bankaccount`, body);
  }
  
  requestWithdrawal(body): Observable<any> {
    return this.http.post<any>(this.baseUrl + `wallet/withdrawal-request`, body);
  }

  setWalletInfo(data: any) {
    this.userWalletData.next(data)
  }

//   getUserById(userId:string):
//   Observable<IUserResponse>{
//     return this.http.get<IUserResponse>(
//       this.api.baseApiUrl + `wallet/${userId}`
//     );
//   }

 

//   fetchUserAddresses(userId: any): Observable<any> {
//     return this.http.get<any>(`${this.api.ecommerceBaseUrl}useraddress/users/${userId}`);
//   }

//   setDefaultAddress(payload: any, id: string): Observable<any> {
//     return this.http.put<any>(`${this.api.ecommerceBaseUrl}useraddress/${id}`, payload);
//   }

//   deleteAddress(id: string): Observable<any> {
//     return this.http.delete<any>(`${this.api.ecommerceBaseUrl}useraddress/${id}`);
//   }

//   getShippingEstimate(payload: any): Observable<any> {
//     return this.http.post<any>(`${this.api.ecommerceBaseUrl}shipping/price-estimates`, payload);
//   }

}
