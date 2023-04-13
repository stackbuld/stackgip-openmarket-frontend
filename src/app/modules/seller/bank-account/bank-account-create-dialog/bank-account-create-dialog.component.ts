import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankAccountService } from 'src/app/shared/services/bank-account.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';

@Component({
  selector: 'app-bank-account-create-dialog',
  templateUrl: './bank-account-create-dialog.component.html',
  styleUrls: ['./bank-account-create-dialog.component.scss'],
})
export class BankAccountCreateDialogComponent implements OnInit {
  mode: string = 'create';
  options = {
    types: [],
  };
  bankList: any[];

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private bankAccountService: BankAccountService,
    private dialogRef: MatDialogRef<BankAccountCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helperService: HelperService
  ) {}

  bankAccountForm: FormGroup;

  ngOnInit(): void {
    this.getBankList();
    this.bankAccountForm = this.fb.group({
      id: [''],
      bank: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
      userId: [this.helperService.getLoggedInUserId(), [Validators.required]],
    });
    this.checkMode();
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
      this.bankCode.patchValue(value.code);
      this.bankName.patchValue(value.name);
      this.bankCode.updateValueAndValidity();
      this.bankName.updateValueAndValidity();
      this.getAccountName()
    });
  }

  getBankList() {
    this.bankAccountService.getBankList().subscribe((bankList) => {
      this.bankList = bankList;
    });
  }

  checkMode() {
    if (this.data) {
      this.mode = 'edit';
      this.bankAccountForm = this.fb.group({
        id: [this.data.id, Validators.required],
        bankName: [this.data.bankName, [Validators.required]],
        bankCode: [this.data.bankCode, [Validators.required]],
        bank: [this.data?.bank, [Validators.required]],
        accountNumber: [this.data.accountNumber, [Validators.required]],
        accountName: [this.data.accountName, [Validators.required]],
        userId: [this.data.userId, [Validators.required]],
      });
      return;
    }
    this.mode = 'create';
    this.bankAccountForm = this.fb.group({
      bankName: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      bank: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
      userId: [this.helperService.getLoggedInUserId(), [Validators.required]],
    });
  }

  getAccountName() {
    if (this.accountNumber.value.length != 10 || this.bankCode.value == "") {
      return;
    }
    this.bankAccountService.validateAccount({
      bankcode: this.bankCode.value,
      accountNumber: this.accountNumber.value,
      countryCode: "NGN"
    })
    .subscribe((response: any) => {
      console.log(response)
      let accountName = response.data.accountName;
      this.accountName.patchValue(accountName)
      this.accountName.updateValueAndValidity()
    })
  }

  onSave() {
    if (this.mode == 'create') {
      this.onCreate();
      return;
    }
    this.onEdit();
  }

  onCreate() {
    this.bankAccountService
      .createBankAccount(this.bankAccountForm.value)
      .subscribe((response: any) => {
        this.dialogService.openSuccessfulDialog(
          '<p>New bank account have been added</p>',
          'view'
        );
        response ? this.dialogRef.close(response) : null;
      });
  }

  onEdit() {
    this.bankAccountService
      .updateBankAccount(this.bankAccountForm.value)
      .subscribe((response: any) => {
        this.dialogService.openSuccessfulDialog(
          '<p>bank account have updated</p>',
          'view'
        );
        response.status == 'success' ? this.dialogRef.close(response) : null;
      });
  }
}
