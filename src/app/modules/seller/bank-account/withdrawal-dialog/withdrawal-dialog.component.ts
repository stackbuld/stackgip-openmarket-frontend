import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankAccountService } from 'src/app/shared/services/bank-account.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-withdrawal-dialog',
  templateUrl: './withdrawal-dialog.component.html',
  styleUrls: ['./withdrawal-dialog.component.scss']
})
export class WithdrawalDialogComponent implements OnInit {
  bankList: any[];

  constructor(
    private fb: FormBuilder,
    private bankAccountService: BankAccountService,
    private dialogRef: MatDialogRef<WithdrawalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService,
    private dialogService: DialogService
  ) {}

  bankAccountForm: FormGroup;

  ngOnInit(): void {
    this.getBankList();
    this.bankAccountForm = this.fb.group({
      bank: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      userId: [this.helperService.getLoggedInUserId(), [Validators.required]],
    });
    this.onSelectBank();
  }

  get bank() {
    return this.bankAccountForm.get('bank');
  }

  get bankName() {
    return this.bankAccountForm.get('bankName');
  }

  get bankCode() {
    return this.bankAccountForm.get('bankCode');
  }

  get accountNumber() {
    return this.bankAccountForm.get('accountNumber');
  }

  get accountName() {
    return this.bankAccountForm.get('accountName');
  }

  onSelectBank() {
    this.bank.valueChanges.subscribe((value) => {
      this.bankCode.patchValue(value.bankCode);
      this.bankName.patchValue(value.bankName);
      this.accountNumber.patchValue(value.accountNumber);
      this.accountName.patchValue(value.accountName);
      this.bankCode.updateValueAndValidity();
      this.bankName.updateValueAndValidity();
      this.accountNumber.updateValueAndValidity();
      this.accountName.updateValueAndValidity();
    });
  }

  getBankList() {
    this.bankAccountService.getUserBankList(this.helperService.getLoggedInUserId()).subscribe((bankList) => {
      console.log(bankList)
      this.bankList = bankList;
    });
  }

  onSave() {
    this.bankAccountService
      .withdraw(this.bankAccountForm.value)
      .subscribe((response: any) => {
        if (response) {
          this.dialogRef.close(response);
          const message = `
          <p class="text-center">The withdrawal request is currently being processed.</p>
          <br/>
          <p class="text-center text-muted">Note : The withdrawal procedure can take 5 to 7 business days.</p>
          `
          const actionButton = `<span class="text-white" routerLink="/landing">Back to home</span>`
          this.dialogService.openSuccessfulDialog(message, actionButton)
        }
      });
  }
}
