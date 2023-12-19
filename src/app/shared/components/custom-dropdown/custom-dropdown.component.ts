import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import UIkit from 'uikit';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
})
export class CustomDropdownComponent implements OnInit {
  private _data = new BehaviorSubject<any[]>([]);
  private _otherdata = new BehaviorSubject<any[]>([]);
  private _bankData = new BehaviorSubject<any>({});
  @ViewChild('target') target: ElementRef;
  @Output() newBankEvent = new EventEmitter<string>();
  @Output() detailsEvent = new EventEmitter<any>();
  @Input('placeholder') placeholder: string;
  @Input() controls: FormControl;
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
    this._data.next(value);
  }

  get bankLists() {
    // get the latest value from _data BehaviorSubject
    return this._data.getValue();
  }

  selectedBank: string = '';

  accountsListForm: FormControl = new FormControl(null, Validators.required);
  bankListForm: FormControl = new FormControl(null, Validators.required);

  constructor(public cd: ChangeDetectorRef) {}
  ngOnInit() {
    this._data.subscribe((x) => {
      this.selectedBank = x?.find(
        (data) => data?.code?.toString() === this.controls?.value?.toString()
      )?.name;
    });

    this._bankData.subscribe((value) => {
      this.selectedBank = this.bankLists?.find(
        (data) => data?.code?.toString() === value?.bankCode?.toString()
      )?.name;
    });
  }

  handleSelect(_, item) {
    this.target.nativeElement.classList.toggle('uk-open');
    // this.el.nativeElement.querySelector(".uk-drop").classList.remove(".uk-open")
    this.selectedBank = item.name;
    this.newBankEvent.emit(item.code);
  }

  handleAccountSelect(_, item) {
    this.target.nativeElement.classList.toggle('uk-open');
    this.selectedBank = item.bankName;

    this.detailsEvent.emit(item);
  }
}
