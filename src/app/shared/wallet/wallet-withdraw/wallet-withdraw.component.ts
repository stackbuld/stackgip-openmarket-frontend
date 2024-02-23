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
import { ToastrService } from 'ngx-toastr';
import { WalletKycPromptComponent } from '../wallet-kyc-prompt/wallet-kyc-prompt.component';
import { Router } from '@angular/router';

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
    private otpService: OtpService,
    private toast: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    this.getBanks();
    this.getBankAccount();
    this.walletService.getWalletInfo.subscribe((data) => {
      this.walletDetails = data;
    });
    this.bankDetailsForm = this.fb.group({
      bankName: ['', [Validators.required]],
      bankCode: ['', [Validators.required]],
      accountName: [''],
      accountNumber: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });

    this.bankDetailsForm.get('amount').valueChanges.subscribe((value) => {
      this.validateAmount(value);
    });
  }

  get bankCode() {
    return <FormControl>this.bankDetailsForm.get('bankCode');
  }

  changeBank(newBankCode: string) {
    this.bankDetailsForm.patchValue({
      bankCode: newBankCode,
      bankName: this.bankLists.find(
        (data) => data?.code?.toString() === newBankCode.toString(),
      )?.name,
      accountName: '',
    });
    if (this.bankDetailsForm.value.accountNumber !== '') {
      this.getAccountName();
    }
  }

  changeDetails(details: any) {
    this.bankDetailsForm.patchValue({
      bankCode: details.bankCode.toString(),
      bankName: this.bankLists.find(
        (data) => data.code.toString() === details.bankCode.toString(),
      ).name,
      accountName: details.accountName,
      accountNumber: details.accountNumber,
    });
    this.selectedBankDetails = details;
  }

  getBankAccount() {
    this.loading = true;
    this.walletService.getBankAccounts(this.user.id).subscribe(
      (res) => {
        if (res.data.length > 0) {
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
        }
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  getBanks() {
    this.walletService.getBanks().subscribe(
      (res) => {
        this.bankLists = res.data;
        localStorage.setItem('bankList', JSON.stringify(this.bankLists));
      },
      (err) => {
        this.loading = false;
      },
    );
  }

  getAccountName() {
    if (this.bankDetailsForm.value.bankCode === '') {
      return;
    }
    this.ngxService.startLoader('loader-01');
    try {
      this.walletService
        .getAccountName({
          bankCode: this.bankDetailsForm.value.bankCode,
          accountNumber: this.bankDetailsForm.value.accountNumber,
          countryCode: 'NGN',
        })
        .subscribe({
          next: (res) => {
            this.ngxService.stopAllLoader('loader-01');
            this.bankDetailsForm.patchValue({
              accountName: res.data.accountName,
            });
          },
          error: (err) => {
            this.ngxService.stopAllLoader('loader-01');
            this.loading = false;
          },
        });
    } catch {}
  }

  sendWithdrawalOtp() {
    // if (!this.user.isKycVerified) {
    //   const dialogRef = this.dialog.open(WalletKycPromptComponent, {
    //     width: '600px',
    //     height: '200px',
    //   });
    //   return;
    // }

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
          detail.accountNumber === this.bankDetailsForm.value.accountNumber,
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
        .subscribe({
          next: (res) => {
            this.selectedBankDetails = res.data;
            this.walletService.sendOtp().subscribe({
              next: (res) => {
                this.withdrawLoading = false;
                this.toast.success('OTP sent successfully!');
                this.ngxService.stopAllLoader('loader-01');
                uikit.modal('#modal-withdrawal').show();
              },
              error: (err) => {
                this.withdrawLoading = false;
                this.ngxService.stopAllLoader('loader-01');
              },
            });
          },
          error: (err) => {
            this.ngxService.stopAllLoader('loader-01');
            this.withdrawLoading = false;
          },
        });
    } else {
      this.walletService.sendOtp().subscribe({
        next: (res) => {
          this.toast.success('OTP sent successfully!');
          this.withdrawLoading = false;
          this.ngxService.stopAllLoader('loader-01');
          uikit.modal('#modal-withdrawal').show();
        },
        error: (err) => {
          this.ngxService.stopAllLoader('loader-01');
          this.withdrawLoading = false;
        },
      });
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

  handleFillEvent(value: string): void {}

  validateAmount(value: number) {
    if (value > this.walletDetails.availableAmount) {
      this.errorMsg = 'Insufficient Funds';
    } else if (!(value > 1)) {
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
        amount: this.bankDetailsForm.value.amount,
        walletId: this.walletDetails.id,
        bankaccountId: this.selectedBankDetails.id,
        currencyCode: this.walletDetails.currencyCode,
        otp: this.otpInput,
      })
      .subscribe({
        next: (res) => {
          this.ngOtp.setValue([]);
          this.withdrawLoading = false;
          uikit.modal('#modal-withdrawal').hide();

          if (!res.succeeded) {
            this.serverResponse = res.message;
            uikit.modal('#modal-message').show();
          } else {
            this.walletService.walletRefresh.next(true);
            this.toast.success('Withdrawal made successfully!');
            this.router.navigate(['/seller/wallet']);
          }
        },
        error: (err) => {
          uikit.modal('#modal-withdrawal').hide();
          uikit.modal.alert('Something went wrong. Please try again Later');
          this.withdrawLoading = false;
        },
      });
  }
}
