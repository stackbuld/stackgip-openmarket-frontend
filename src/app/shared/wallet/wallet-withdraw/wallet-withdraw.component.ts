import { Component, SimpleChanges, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxOtpInputConfig } from 'ngx-otp-input';
import { IUser } from '../../../models/IUserModel';
import { WalletService } from '../../../services/wallet/wallet.service';
import { OtpService } from '../../components/otp/service/otp.service';
import { PopupComponent } from '../../components/popup/popup.component';
import uikit from 'uikit';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgOtpInputComponent } from 'ng-otp-input';

@Component({
  selector: 'app-wallet-withdraw',
  templateUrl: './wallet-withdraw.component.html',
  styleUrls: [
    '../wallet.component.scss',
    './wallet-withdraw.component.scss',
    '../../css/spinner.css',
  ],
})
export class WalletWithdrawComponent {
  loading: boolean;
  withdrawLoading: boolean;
  user: IUser;
  otpInput: string;
  bankDetails: any;
  selectedBankDetails: any;
  bankId: string;
  bankLists: any[] = [];
  serverResponse: string;
  errorMsg = null;
  walletDetails: any;
  bankDetailsForm: FormGroup;
  @ViewChild('ngotp') ngOtp: NgOtpInputComponent;

  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class',
    },
  };

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private walletService: WalletService,
    private ngxService: NgxUiLoaderService,
    private otpService: OtpService
  ) {}

  ngOnInit(): void {
    this.getBanks();
    this.getBankAccount();
    this.walletService.getWalletInfo.subscribe((data) => {
      this.walletDetails = data;
    });
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.bankDetailsForm = this.fb.group({
      bankName: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      accountName: [''],
      accountNumber: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }

  get bankCode() {
    return <FormControl>this.bankDetailsForm.get('bankCode');
  }

  changeBank(newBankCode: string) {
    this.bankDetailsForm.patchValue({
      bankCode: newBankCode,
      bankName: this.bankLists.find(
        (data) => data?.code?.toString() === newBankCode.toString()
      )?.name,
      accountName: '',
    });
  }

  changeDetails(details: any) {
    this.bankDetailsForm.patchValue({
      bankCode: details.bankCode.toString(),
      bankName: this.bankLists.find(
        (data) => data.code.toString() === details.bankCode.toString()
      ).name,
      accountName: details.accountName,
      accountNumber: details.accountNumber,
    });

    this.selectedBankDetails = details;
  }

  getBankAccount() {
    this.loading = true;
    this.walletService.getBankAccounts().subscribe(
      (res) => {
        const data = res.data[0];
        this.bankDetailsForm.patchValue({
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          bankName: data.bankName,
          bankCode: data.bankCode,
        });
        this.loading = false;
        this.selectedBankDetails = data;
        this.bankDetails = res.data;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  getBanks() {
    this.walletService.getBanks().subscribe(
      (res) => {
        this.bankLists = res.data;
      },
      (err) => {
        console.log(err);
        this.loading = false;
      }
    );
  }

  getAccountName() {
    this.ngxService.startLoader('loader-01');
    this.walletService
      .getAccountName({
        bankCode: this.bankDetailsForm.value.bankCode,
        accountNumber: this.bankDetailsForm.value.accountNumber,
        countryCode: 'NGN',
      })
      .subscribe(
        (res) => {
          this.ngxService.stopAllLoader('loader-01');
          this.bankDetailsForm.patchValue({
            accountName: res.data.accountName,
          });
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
  }

  sendWithdrawalOtp() {
    if (
      !this.bankDetailsForm.value.accountName ||
      !this.bankDetailsForm.value.accountNumber
    ) {
      return;
    }

    this.withdrawLoading = true;
    this.ngxService.startLoader('loader-01');
    if (
      !this.bankDetails ||
      !this.bankDetails.find(
        (detail: any) =>
          detail.accountNumber === this.bankDetailsForm.value.accountNumber
      )
    ) {
      const { bankName, bankCode, accountNumber, accountName } =
        this.bankDetailsForm.value;
      this.walletService
        .addToAccountsLists({
          bankName: bankName,
          bankCode: bankCode,
          accountNumber: accountNumber,
          accountName: accountName,
          userId: this.user.id,
        })
        .subscribe(
          (res) => {
            console.log(res);
            this.selectedBankDetails = res.data;
            this.walletService.sendOtp().subscribe(
              (res) => {
                this.withdrawLoading = false;
                this.ngxService.stopAllLoader('loader-01');
                uikit.modal('#modal-withdrawal').show();
              },
              (err) => {
                console.log(err);
                this.withdrawLoading = false;
                this.ngxService.stopAllLoader('loader-01');
              }
            );
          },
          (err) => {
            console.log(err);
            this.ngxService.stopAllLoader('loader-01');
            this.withdrawLoading = false;
          }
        );
    } else {
      this.walletService.sendOtp().subscribe(
        (res) => {
          this.withdrawLoading = false;
          this.ngxService.stopAllLoader('loader-01');
          uikit.modal('#modal-withdrawal').show();
        },
        (err) => {
          console.log(err);
          this.ngxService.stopAllLoader('loader-01');
          this.withdrawLoading = false;
        }
      );
    }
  }

  openModal() {
    this.dialog.open(PopupComponent, {
      width: '400px',
      height: '300px',
    });
  }

  handeOtpChange(value: string): void {
    if (value.length === 6) {
      this.otpInput = value.toString();
    }
  }

  handleFillEvent(value: string): void {
    console.log(value);
  }

  validateAmount() {
    if (
      this.bankDetailsForm.value.amount > this.walletDetails.availableAmount
    ) {
      this.errorMsg = 'Insufficient Funds';
    } else if (!(this.bankDetailsForm.value.amount > 1)) {
      this.errorMsg = `Minimum withdrawal must be atleast ${this.walletDetails.currencyCode} 1`;
    } else {
      this.errorMsg = null;
    }
  }

  handleWithdraw(): void {
    if (this.otpInput.length < 6) {
      return;
    }
    this.withdrawLoading = true;
    this.walletService
      .requestWithdrawal({
        amount: this.bankDetailsForm.value.amount as string,
        walletId: this.walletDetails.id,
        bankaccountId: this.selectedBankDetails.id,
        currencyCode: this.walletDetails.currencyCode,
        otp: this.otpInput,
      })
      .subscribe(
        (res) => {
          this.ngOtp.setValue([]);
          this.withdrawLoading = false;
          uikit.modal('#modal-withdrawal').hide();

          if (!res.succeded) {
            this.serverResponse = res.message;
            uikit.modal('#modal-message').show();
          } else {
            uikit.modal.alert('Successful');
          }
        },
        (err) => {
          uikit.modal('#modal-withdrawal').hide();
          uikit.modal.alert('Something went wrong. Please try again Later');
          console.log(err);
          this.withdrawLoading = false;
        }
      );
  }
}
