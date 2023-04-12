import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private baseUrl = environment.walletApi
  private bankList: any[] = []
  private bankListListener = new Subject<any[]>()
  private userBankList: any[] = []
  private userBankListListener = new Subject<any[]>()


  constructor(
    private http: HttpClient
  ) { }



  getUserBankList(userId) {
    this.http.get(`${this.baseUrl}api/v1/bankaccount/user/${userId}`)
    .subscribe((res: any) => {
      console.log(res)
      this.userBankList = res.data
      this.userBankListListener.next(this.userBankList)
    })

    return this.userBankListListener.asObservable()
  }

  getBankList(countryCode="NGN") {
    this.http.get(`${this.baseUrl}api/v1/bankaccount/banks/${countryCode}`)
    .subscribe((res: any) => {
      console.log(res)
      this.bankList = res.data
      this.bankListListener.next(this.bankList)
    })

    return this.bankListListener.asObservable()
  }

  createBankAccount(bankAccountInfo) {
    return this.http.post(`${this.baseUrl}api/v1/bankaccount`, bankAccountInfo)

  }

  updateBankAccount(bankAccountInfo) {
    return this.http.put(`${this.baseUrl}api/v1/bankaccount?id=${bankAccountInfo.id}`, bankAccountInfo)
  }

  deleteBankAccount(bankAccountInfo) {
    return this.http.delete(`${this.baseUrl}api/v1/bankaccount?id=${bankAccountInfo.id}`)
  }

  withdraw(value) {
    return of(true)
  }
}
