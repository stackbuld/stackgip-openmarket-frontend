import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SellerStores } from 'src/app/models/StoreModels';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import {
  CreateProductResponse,
  SellerStore,
} from '../../../../models/products.model';
import { SellerStoreCreateDialogComponent } from '../seller-store-create-dialog/seller-store-create-dialog.component';
import { ToastrService } from 'src/app/services/toastr.service';

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
  panelOpenState: boolean[] = [];
  storeId: string;
  isMadeFirstDefault: boolean = false;
  editFromClick: boolean = false;

  constructor(
    private helperService: HelperService,
    private sellerStoreService: SellerStoreService,
    private dialogService: DialogService,
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getSellerStoreList();
  }

  createSellerStoreCreate(data: SellerStores | null, mode: string) {
    this.dialogService
      .openDialog(SellerStoreCreateDialogComponent, {
        data: { data, mode },
      })
      .afterClosed()
      .subscribe((response) => {
        response ? this.getSellerStoreList() : null;
      });
  }

  onEdit(sellerStore: SellerStores, fromClick: boolean) {
    if (this.isMadeFirstDefault && !fromClick) {
      return;
    }
    sellerStore.isDefault = !sellerStore.isDefault;
    this.isLoading = true;
    this.sellerStoreService
      .updateSellerStore(sellerStore, sellerStore.id)
      .subscribe({
        next: (response: any) => {
          this.toast.success('Default store updated');
          this.getSellerStoreList();
        },
        error: () => {
          this.isLoading = false;
          this.toast.error('Something went wrong!');
        },
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
    this.sellerStoreService.deleteSellerStore(sellerStore).subscribe({
      next: (res: any) => {
        this.dialogService.openSuccessfulDialog(res.data, 'OK');
        this.getSellerStoreList();
      },
      error: (err) => {
        this.toast.error('Can not delete a default store!');
      },
    });
  }

  closeEditProductModal(): void {
    this.closeEdit.nativeElement.click();
  }

  getSellerStoreList() {
    this.isLoading = true;
    this.sellerStoreService
      .getSellerstores(this.helperService.getLoggedInUserId())
      .subscribe({
        next: (sellerStores) => {
          this.sellerStores = sellerStores;
          // if (sellerStores.length > 0) {
          //   if (!this.sellerStores.find((store) => store.isDefault == true)) {
          //     this.sellerStores[0].isDefault = true;
          //     this.onEdit(this.sellerStores[0], false);
          //     this.isMadeFirstDefault = true;
          //   }
          // }

          this.isLoading = false;
        },
        error: (err) => {
          this.toast.error('An error ocurred!');
          this.isLoading = false;
        },
      });
  }

  onExpand(index: number) {
    this.panelOpenState[index] = !this.panelOpenState[index];
  }
}
