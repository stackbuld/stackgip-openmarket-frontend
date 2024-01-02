import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SellerStores } from 'src/app/models/StoreModels';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { BankAccountService } from 'src/app/shared/services/bank-account.service';
import { BankAccountCreateDialogComponent } from '../bank-account-create-dialog/bank-account-create-dialog.component';
import { bankData } from 'src/app/models/wallet.model';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss'],
})
export class BankAccountListComponent implements OnInit {
  bankAccountList: bankData[];
  isLoading: boolean = true;
  constructor(
    private helperService: HelperService,
    private bankAccountService: BankAccountService,
    private dialogService: DialogService
  ) {}
  ngOnInit(): void {
    this.getBankAccountList();
  }

  addBankAccount(data) {
    this.dialogService
      .openDialog(BankAccountCreateDialogComponent, {
        width: '500px',
        data,
      })
      .afterClosed()
      .subscribe((response) => {
        response ? this.getBankAccountList() : null;
      });
  }

  onDeleteBankAccount(bankAccountInfo) {
    const title = 'Delete Bank Info?';
    const subtitle = `Are you sure you want to delete ${bankAccountInfo.name}? <br> You can’t undo this action.`;
    const message = `By deleting this store, <strong> ${
      bankAccountInfo.number | 12
    } products </strong> in this store will automatically move to the Default Store.`;
    const actionButton = `Delete Store <img src="../../../../assets/svg/delete-seller-store-white.svg" alt="" />`;
    this.dialogService
      .openDeleteDialog(title, subtitle, message, actionButton)
      .afterClosed()
      .subscribe((response) => {
        response ? this.deleteBankAccount(bankAccountInfo) : null;
      });
  }

  deleteBankAccount(bankAccountInfo) {
    this.bankAccountService.deleteBankAccount(bankAccountInfo);
  }

  getBankAccountList() {
    this.isLoading = true;
    this.bankAccountService
      .getUserBankList(this.helperService.getLoggedInUserId())
      .subscribe((bankAccountList) => {
        this.bankAccountList = bankAccountList;
        this.isLoading = false;
      });
  }
}
