import { IResponseModel } from './../../shared/models/IResponseModel';
import {
  BankAccountDetails,
  IBankAccount,
  IRequestResponse,
  ITransactionsResponse,
  IWalletResponse,
  WalletActionsResponse,
  WalletWithdrawalRequest,
  bankData,
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
  walletRefresh = new BehaviorSubject<boolean>(true);
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

  getTransactions(data: {
    userId: string;
    pageSize: number;
    page: number;
    walletId?: string;
    dateType?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<ITransactionsResponse> {
    const url = data.walletId
      ? `wallet/transactions?DateType=${data.dateType}&StartDate=${data.startDate}&EndDate=${data.endDate}&UserId=${data.userId}&WalletId=${data.walletId}&PageSize=${data.pageSize}&Page=${data.page}`
      : `wallet/transactions?DateType=${data.dateType}&StartDate=${data.startDate}&EndDate=${data.endDate}&UserId=${data.userId}&PageSize=${data.pageSize}&Page=${data.page}`;
    return this.http.get<ITransactionsResponse>(this.baseUrl + url);
  }

  getLockedFunds(data: {
    userId: string;
    pageSize: number;
    page: number;
    walletId?: string;
  }): Observable<ITransactionsResponse> {
    return this.http.get<ITransactionsResponse>(
      this.baseUrl +
        `wallet/transactions/lockedfunds?UserId=${data.userId}&WalletId=${data.walletId}&PageSize=${data.pageSize}&Page=${data.page}`
    );
  }

  getRequests(id: string): Observable<IRequestResponse> {
    return this.http.get<IRequestResponse>(
      this.baseUrl + `wallet/withdrawal-requests?UserId=${id}`
    );
  }

  getAccountName(body: BankAccountDetails): Observable<WalletActionsResponse> {
    return this.http.post<WalletActionsResponse>(
      this.baseUrl + `bankaccount/banks/validate-account`,
      body
    );
  }

  getBankAccounts(userId: string): Observable<IBankAccount> {
    return this.http.get<IBankAccount>(
      this.baseUrl + `bankaccount/user?userId=${userId}`
    );
  }

  sendOtp(): Observable<bankData> {
    return this.http.post<bankData>(
      this.baseUrl + `wallet/withdrawal-request-otp`,
      null
    );
  }

  addToAccountsLists(body: bankData): Observable<WalletActionsResponse> {
    return this.http.post<WalletActionsResponse>(
      this.baseUrl + `bankaccount`,
      body
    );
  }

  requestWithdrawal(
    body: WalletWithdrawalRequest
  ): Observable<WalletActionsResponse> {
    return this.http.post<WalletActionsResponse>(
      this.baseUrl + `wallet/withdrawal-request`,
      body
    );
  }

  setWalletInfo(data: any) {
    this.userWalletData.next(data);
  }
}
