import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-variations-alert-dialog',
  templateUrl: './variations-alert-dialog.component.html',
  styleUrls: ['./variations-alert-dialog.component.scss'],
})
export class VariationsAlertDialogComponent implements OnInit {
  actualProductUnit: number = 0;
  exceededProductUnit: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { initialUnit: number; exceededUnit: number },
    private dialog: MatDialog,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.actualProductUnit = this.data.initialUnit;
    this.exceededProductUnit = this.data.exceededUnit;
  }

  onClose(action: string) {
    if (action == 'increase') {
      this.productService.newProductUnit.next(this.exceededProductUnit);
    }
    if (action == 'adjust') {
      this.productService.exceededUnitAction.next(true);
    }
    this.dialog.closeAll();
  }
}
