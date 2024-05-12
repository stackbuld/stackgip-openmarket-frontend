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
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import {
  BehaviorSubject,
  Subscription,
  map,
  startWith,
  Observable,
} from 'rxjs';
import { bankData } from 'src/app/models/wallet.model';
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
  private _otherdata = new BehaviorSubject<bankData[]>([]);
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

  @Input() set accountsLists(value) {
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
    this.bankListData = value;
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
  filteredBanks: Observable<Bank[]>;
  bankNameSelected: string = '';
  constructor(
    public cd: ChangeDetectorRef,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.bankListData = JSON.parse(localStorage.getItem('bankList'))!;

    this.bankListForm = new FormGroup({
      bank: new FormControl(null, Validators.required),
    });

    this._data.subscribe((x) => {
      const selectedBank = x?.find(
        (data) => data?.code?.toString() === this.controls?.value?.toString()
      )?.name;
      if (selectedBank) {
        this.selectedBank = selectedBank;
      } else {
        this.selectedBank = null;
      }
    });

    this._bankData.subscribe((value) => {
      const selectedBank = this.bankLists?.find(
        (data) => data?.code?.toString() === value?.bankCode?.toString()
      )?.name;
      if (selectedBank) {
        this.selectedBank = selectedBank;
      } else {
        this.selectedBank = null;
      }
    });

    this.filteredBanks = this.bankListForm.controls['bank'].valueChanges.pipe(
      startWith(''),
      map((bankName) => this._filter(bankName || ''))
    );

    this.accountsListForm.valueChanges.subscribe((value) => {
      const account = this.findBankOrAccount(
        this.accountsLists,
        value,
        'accountNumber'
      );
      this.detailsEvent.emit(account);
      this.bankListData = JSON.parse(localStorage.getItem('bankList'))!;
      this.bankIndex = this.bankListData.findIndex(
        (bank) => bank.code == account?.bankCode
      );
    });

    this.bankValueSub = this.walletService.setValue.subscribe((value) => {
      this.bankListForm.setValue({ bank: this.bankListData[value].name });
    });
  }

  private _filter(value: string): Bank[] {
    const filterValue = value.toLowerCase();
    return this.bankListData.filter((bank) =>
      bank.name.toLowerCase().includes(filterValue)
    );
  }

  setOptionValue(event: MatOptionSelectionChange<string>): void {
    const bankCode = this.bankListData.find(
      (x) => x.name == event.source.value
    );
    if (bankCode) {
      this.newBankEvent.emit(bankCode.code);
    }
  }

  onSelect(event: MatSelectChange) {
    const account = this.findBankOrAccount(
      this.accountsLists,
      event.value,
      'accountNumber'
    );

    this.bankListData = JSON.parse(localStorage.getItem('bankList'))!;
    this.bankIndex = this.bankListData.findIndex(
      (bank) => bank.code == account?.bankCode
    );

    this.walletService.setValue.next(this.bankIndex);
  }

  onAdd() {
    this.bankListForm.setValue({
      bank: this.bankListData[10].name,
    });
  }

  findBankOrAccount(
    accountDetails: bankData[],
    accountNumber: string,
    prop: string
  ) {
    return accountDetails.find((account) => account[prop] == accountNumber);
  }

  ngOnDestroy(): void {
    if (this.bankValueSub) {
      this.bankValueSub.unsubscribe();
    }
  }
}
