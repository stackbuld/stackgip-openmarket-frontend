import { IResponseModel } from './../../shared/models/IResponseModel';
import {
  IBankAccount,
  IRequestResponse,
  ITransactionsResponse,
  IWalletResponse,
} from '../../models/wallet.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IUpdateUser, IUserResponse } from './../../models/IUserModel';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiAppUrlService } from '../api-app-url.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  baseUrl: string;
  private userWalletData = new BehaviorSubject([]);
  setValue = new Subject<number>();

  getWalletInfo = this.userWalletData.asObservable();
  constructor(private api: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = api.walletBaseUrl;
  }

  getWallet(): Observable<IWalletResponse> {
    console.log('Pre-api part');
    return this.http.get<IWalletResponse>(this.baseUrl + `wallet/user`);
  }

  getBanks(): Observable<IWalletResponse> {
    return this.http.get<IWalletResponse>(
      this.baseUrl + `bankaccount/banks/NGN`
    );
  }

  getTransactions(): Observable<ITransactionsResponse> {
    return this.http.get<ITransactionsResponse>(
      this.baseUrl + `payments/transactions`
    );
  }
  getRequests(): Observable<IRequestResponse> {
    return this.http.get<IRequestResponse>(
      this.baseUrl + `wallet/withdrawal-requests`
    );
  }

  getAccountName(body): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + `bankaccount/banks/validate-account`,
      body
    );
  }

  getBankAccounts(): Observable<IBankAccount> {
    return this.http.get<IBankAccount>(this.baseUrl + `bankaccount/user`);
  }

  sendOtp(): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + `wallet/withdrawal-request-otp`,
      null
    );
  }

  addToAccountsLists(body): Observable<any> {
    return this.http.post<any>(this.baseUrl + `bankaccount`, body);
  }

  requestWithdrawal(body): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + `wallet/withdrawal-request`,
      body
    );
  }

  setWalletInfo(data: any) {
    this.userWalletData.next(data);
  }
}
