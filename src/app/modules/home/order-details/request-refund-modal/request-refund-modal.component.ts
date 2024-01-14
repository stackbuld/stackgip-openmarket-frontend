import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-request-refund-modal',
  templateUrl: './request-refund-modal.component.html',
  styleUrls: ['./request-refund-modal.component.scss'],
})
export class RequestRefundModalComponent implements OnInit {
  refundReasons: string[] = [
    'I changed my mind',
    'Item stopped working',
    'Packaging was damaged',
    'Item received broken or damaged',
    'Item seem to be fake and unauthentic',
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  onCloseModal() {
    this.dialog.closeAll();
  }
}
