import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CartService} from "../../../../services/cart/cart.service";
import {Toast, ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-product-delete-modal',
    templateUrl: './product-delete-modal.component.html',
    styleUrls: ['./product-delete-modal.component.scss']
})
export class ProductDeleteModalComponent {
    deletingCartItem: boolean = false

    constructor(private dialog: MatDialogRef<ProductDeleteModalComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private cartService: CartService, private toastService: ToastrService) {
    }

    deleteCartItem() {
        this.deletingCartItem = true
        this.cartService.deleteCartItem(this.data).subscribe({
            next: (res) => {
                this.deletingCartItem = false;
                this.toastService.success(res.message, 'SUCCESS');
                this.dialog.close('deleted')
            },
            error: (error) => {
                this.deletingCartItem = false;
                this.toastService.error(error.message, 'ERROR');
            },
        });
    }

    closeDeleteDialog() {
        this.dialog.close('closed')
    }
}
