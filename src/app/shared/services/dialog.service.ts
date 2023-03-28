import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WithdrawalDialogComponent } from 'src/app/modules/seller/bank-account/withdrawal-dialog/withdrawal-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { DeleteDialogComponent } from '../components/delete-dialog/delete-dialog.component';
import { SuccessfulDialogComponent } from '../components/successful-dialog/successful-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(component, configuration) {
    return this.dialog.open(component, configuration);
  }

  openDeleteDialog(
    title = '',
    subtitle = '',
    message = '',
    actionButtonText = 'Delete',
    cancelButtonText = 'Cancel'
  ) {
    return this.dialog.open(DeleteDialogComponent, {
      data: {
        panelClass: 'delete-dialog',
        width: '700px',
        title,
        subtitle,
        message,
        actionButtonText,
        cancelButtonText,
      },
    });
  }

  openConfirmDialog(
    title = '',
    subtitle = '',
    message = '',
    actionButtonText = 'Delete',
    cancelButtonText = 'Cancel'
  ) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        panelClass: 'delete-dialog',
        title,
        subtitle,
        message,
        actionButtonText,
        cancelButtonText,
      },
    });
  }

  openSuccessfulDialog(message, actionButtonText) {
    this.dialog.open(SuccessfulDialogComponent, {
      width: '500px',
      data: {
        panelClass: 'delete-dialog',
        message,
        actionButtonText,
      },
    });
  }

  openWithdrawalDialog() {
    return this.dialog.open(WithdrawalDialogComponent,{
      width: "500px"
    });
  }
}
