import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buyer-transactions',
  templateUrl: './buyer-transactions.component.html',
  styleUrls: ['./buyer-transactions.component.scss'],
})
export class BuyerTransactionsComponent implements OnInit {
  transactions: {
    id: string;
    amount: number;
    date: string;
    type: string;
    category: string;
    status: string;
  }[] = [
    {
      id: 'Invoice-#2309',
      amount: 25000,
      date: '12 Mar 2023, 12:03',
      type: 'credit',
      category: 'airtime purchase',
      status: 'pending',
    },
    {
      id: 'Invoice-#2409',
      amount: 49000,
      date: '19 Mar 2023, 12:03',
      type: 'debit',
      category: 'withdraw',
      status: 'pending',
    },
    {
      id: 'Invoice-#2109',
      amount: 2000,
      date: '14 Mar 2023, 12:03',
      type: 'credit',
      category: 'funding',
      status: 'success',
    },
    {
      id: 'Invoice-#2609',
      amount: 282600,
      date: '14 Mar 2023, 12:03',
      type: 'credit',
      category: 'sales revenue',
      status: 'cancelled',
    },
    {
      id: 'Invoice-#2309',
      amount: 25000,
      date: '12 Mar 2023, 12:03',
      type: 'credit',
      category: 'airtime purchase',
      status: 'pending',
    },
    {
      id: 'Invoice-#2409',
      amount: 49000,
      date: '19 Mar 2023, 12:03',
      type: 'debit',
      category: 'withdraw',
      status: 'pending',
    },
    {
      id: 'Invoice-#2109',
      amount: 2000,
      date: '14 Mar 2023, 12:03',
      type: 'credit',
      category: 'funding',
      status: 'success',
    },
    {
      id: 'Invoice-#2609',
      amount: 282600,
      date: '14 Mar 2023, 12:03',
      type: 'credit',
      category: 'sales revenue',
      status: 'cancelled',
    },
  ];
  constructor() {}
  ngOnInit(): void {}
}
