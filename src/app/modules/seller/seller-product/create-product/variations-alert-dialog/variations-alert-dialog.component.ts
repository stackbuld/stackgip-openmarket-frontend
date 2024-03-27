import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProductsService } from 'src/app/services/products/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-variations-alert-dialog',
  templateUrl: './variations-alert-dialog.component.html',
  styleUrls: ['./variations-alert-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class VariationsAlertDialogComponent implements OnInit {
  type!: string;
  actualProductUnit: number = 0;
  exceededProductUnit: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { initialUnit: number; exceededUnit: number; type: string },
    private dialog: MatDialogRef<any>,
    private productService: ProductsService,
  ) {}

  ngOnInit(): void {
    this.actualProductUnit = this.data.initialUnit;
    this.exceededProductUnit = this.data.exceededUnit;
    this.type = this.data.type;
  }

  onClose(action: string) {
    if (this.type == 'addingVariantAlert') {
      if (action == 'increase') {
        this.dialog.close(null);
      }
      if (action == 'adjust') {
        this.dialog.close('continue');
      }

      return;
    }

    if (action == 'increase') {
      this.productService.newProductUnit.next(this.exceededProductUnit);
      this.dialog.close('increase');
    }
    if (action == 'adjust') {
      this.productService.exceededUnitAction.next(true);
      this.dialog.close(null);
    }
  }
}
