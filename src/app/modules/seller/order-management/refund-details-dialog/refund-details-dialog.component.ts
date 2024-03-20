import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Refund } from '../../../../models/order.model';

@Component({
  selector: 'app-refund-details-dialog',
  templateUrl: './refund-details-dialog.component.html',
  styleUrls: ['./refund-details-dialog.component.scss'],
})
export class RefundDetailsDialogComponent implements OnInit {
  refundData!: Refund;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { refund: Refund },
    private dialog: MatDialog,
  ) {}
  ngOnInit() {
    this.refundData = this.data.refund;
    console.log(this.data);
  }

  onCloseDialog() {
    this.dialog.closeAll();
  }
}
