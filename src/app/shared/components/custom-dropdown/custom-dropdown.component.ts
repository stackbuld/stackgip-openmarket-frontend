import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WalletService } from 'src/app/services/wallet/wallet.service';

interface Bank {
  code: string;
  currency: string;
  name: string;
  country: string;
}

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
})
export class CustomDropdownComponent implements OnInit, OnDestroy {
  private _data = new BehaviorSubject<any[]>([]);
  private _otherdata = new BehaviorSubject<any[]>([]);
  private _bankData = new BehaviorSubject<any>({});
  bankListData: Bank[] = [];
  @ViewChild('target') target: ElementRef;
  @Output() newBankEvent = new EventEmitter<string>();
  @Output() detailsEvent = new EventEmitter<any>();
  @Input('placeholder') placeholder: string;
  @Input() controls: FormControl;
  @Input() type!: string;
  @Input()
  set chosenBank(value) {
    this._bankData.next(value);
  }
  get chosenBank() {
    return this._bankData.getValue();
  }

  @Input()
  set accountsLists(value) {
    this._otherdata.next(value);
  }
  get accountsLists() {
    return this._otherdata.getValue();
  }
  @Input()
  set bankLists(value) {
    // set the latest value for _data BehaviorSubject
    if (value.length > 0) {
      localStorage.setItem('bankList', JSON.stringify(value));
    }

    this._data.next(value);
  }

  get bankLists() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }

  selectedBank: string = '';

  accountsListForm: FormControl = new FormControl(null, Validators.required);
  bankListForm: FormGroup;
  selectedBankCode: string;
  bankIndex: number;
  bankValueSub: Subscription;

  constructor(
    public cd: ChangeDetectorRef,
    private walletService: WalletService,
  ) {}

  ngOnInit() {
    this.bankListData = JSON.parse(localStorage.getItem('bankList')) ?? [];

    this.bankListForm = new FormGroup({
      bank: new FormControl(null, Validators.required),
    });

    this._data.subscribe((x) => {
      this.selectedBank = x?.find(
        (data) => data?.code?.toString() === this.controls?.value?.toString(),
      )?.name;
    });

    this._bankData.subscribe((value) => {
      this.selectedBank = this.bankLists?.find(
        (data) => data?.code?.toString() === value?.bankCode?.toString(),
      )?.name;
    });

    this.accountsListForm.valueChanges.subscribe((value) => {
      const account = this.findBankOrAccount(
        this.accountsLists,
        value,
        'accountNumber',
      );

      this.detailsEvent.emit(account);

      this.bankIndex = this.bankListData.findIndex(
        (bank) => bank.code == account?.bankCode,
      );
    });

    this.bankValueSub = this.walletService.setValue.subscribe((value) => {
      this.bankListForm.setValue({ bank: this.bankListData[value] });
    });
  }

  onSelect(event) {
    const account = this.findBankOrAccount(
      this.accountsLists,
      event.value,
      'accountNumber',
    );

    this.bankIndex = this.bankListData.findIndex(
      (bank) => bank.code == account?.bankCode,
    );

    this.walletService.setValue.next(this.bankIndex);
  }

  onAdd() {
    this.bankListForm.setValue({
      bank: this.bankListData[10],
    });
  }

  findBankOrAccount(listType: any[], accountDetail: string, prop: string) {
    return listType.find((account) => account[prop] == accountDetail);
  }

  ngOnDestroy(): void {
    if (this.bankValueSub) {
      this.bankValueSub.unsubscribe();
    }
  }
}
