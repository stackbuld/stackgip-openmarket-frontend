import { Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
  transactions: {
    heading: string;
    remark: string;
    date: string;
    amount: number;
    type: string;
  }[] = [
    {
      heading: 'Money moved to escrow wallet',
      remark: 'Order delivered',
      date: '5th January 2024',
      amount: 5000,
      type: 'normal-to',
    },
    {
      heading: 'Money moved from escrow walleet to main wallet',
      remark: 'Refund time elapsed',
      date: '5th January 2024',
      amount: 5000,
      type: 'normal-from',
    },
    {
      heading: 'Withdrawal from main wallet ',
      remark: 'Main wallet withdrawal',
      date: '5th January 2024',
      amount: 5000,
      type: 'withdrawal',
    },
    {
      heading: 'Main wallet funded',
      remark: 'Top up ',
      date: '5th January 2024',
      amount: 5000,
      type: 'normal-to',
    },
    {
      heading: 'Money moved from cash back wallet',
      remark: 'Reward ',
      date: '5th January 2024',
      amount: 5000,
      type: 'normal-from',
    },
  ];
}
