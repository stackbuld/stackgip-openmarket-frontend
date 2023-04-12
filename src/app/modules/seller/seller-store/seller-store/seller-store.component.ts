import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SellerStores } from 'src/app/models/StoreModels';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import { CreateProductResponse } from '../../../../models/products.model';
import { SellerStoreCreateDialogComponent } from '../seller-store-create-dialog/seller-store-create-dialog.component';

@Component({
  selector: 'app-seller-store',
  templateUrl: './seller-store.component.html',
  styleUrls: ['./seller-store.component.css'],
})
export class SellerStoreComponent implements OnInit {
  @ViewChild('closeEdit') closeEdit: ElementRef<HTMLElement>;
  cproduct: CreateProductResponse[];
  sellerStores: SellerStores[];
  isLoading: boolean = true;

  constructor(
    private helperService: HelperService,
    private sellerStoreService: SellerStoreService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.getSellerStoreList();
  }

  createSellerStoreCreate(data) {
    this.dialogService
      .openDialog(SellerStoreCreateDialogComponent, { data })
      .afterClosed()
      .subscribe((response) => {
        response ? this.getSellerStoreList() : null;
      });
  }

  onEdit(sellerStore) {
    sellerStore.isDefault = true;
    this.sellerStoreService
      .updateSellerStore(sellerStore)
      .subscribe((response: any) => {
        console.log(response);
        this.getSellerStoreList();
        // response.status == "success" ? this.dialogRef.close(response) : null
      });
  }

  onDeleteStore(sellerStore) {
    const title = 'Delete Store?';
    const subtitle = `Are you sure you want to delete ${sellerStore.storeName}? <br> You can’t undo this action.`;
    const message = `By deleting this store, <strong> ${sellerStore.productCount} products </strong> in this store will automatically move to the Default Store.`;
    const actionButton = `Delete Store <img src="../../../../assets/svg/delete-seller-store-white.svg" alt="" />`;
    this.dialogService
      .openDeleteDialog(title, subtitle, message, actionButton)
      .afterClosed()
      .subscribe((response) => {
        response ? this.deleteSeller(sellerStore) : null;
      });
  }

  deleteSeller(sellerStore) {
    this.sellerStoreService
      .deleteSellerStore(sellerStore)
      .subscribe((res: any) => {
        this.dialogService.openSuccessfulDialog(res.data, 'OK');
        this.getSellerStoreList();
      });
  }

  closeEditProductModal(): void {
    this.closeEdit.nativeElement.click();
  }

  getSellerStoreList() {
    this.isLoading = true;
    this.sellerStoreService
      .getSellerstores(this.helperService.getLoggedInUserId())
      .subscribe((sellerStores) => {
        this.sellerStores = sellerStores;
        this.isLoading = false;
      });
  }
}
