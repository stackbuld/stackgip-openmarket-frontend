import { Component, inject } from '@angular/core';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent {

  private dialogService = inject(DialogService)

  onConfirmOrder() {
    this.dialogService.openConfirmOrderDialog()
  }

}
