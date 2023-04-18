import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  all = true;
  pending = false;
  success = false;
  others = false

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

  }

  switchTabs = (key: string) => {
    if (key === 'all') {
      this.all = true;
      this.pending = false;
      this.success = false;
      this.others = false;
    }

    if (key === 'others') {
      this.all = false;
      this.pending = false;
      this.success = false;
      this.others = true;
    }

    if (key === 'success') {
      this.all = false;
      this.pending = false;
      this.success = true;
      this.others = false;
    }

    if (key === 'pending') {
      this.all = false;
      this.pending = true;
      this.success = false;
      this.others = false;
    }
  }
}
