import { Subject, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-delete-product-confirmation',
  template: ` <p-dialog
    header="Delete product"
    [modal]="true"
    [(visible)]="isVisible"
    [position]="'top'"
    [style]="{ width: '500px' }"
    [breakpoints]="{ '1199px': '500px', '575px': '95vw' }"
  >
    <p>Are you sure you want to delete this product.</p>

    <ng-template pTemplate="footer">
      <p-button
        label="Yes"
        [loading]="isLoading"
        [style]="{
          'background-color': '#f23b3b',
          color: '#fff',
          border: 'none',
          'border-radius': '5px',
          padding: '0.5rem 1.5rem',
          outline: 'none'
        }"
        (click)="deleteProduct(true)"
      />
      <p-button
        label="Cancel"
        (click)="deleteProduct(false)"
        [style]="{ 'margin-left': '1rem', 'border-radius': '5px' }"
      />
    </ng-template>
  </p-dialog>`,
})
export class DeleteProductConfirmation implements OnDestroy, OnInit {
  public isVisible: boolean = false;
  private toast = inject(ToastrService);
  private router = inject(Router);
  private productService = inject(ProductsService);
  @Input() public productId: string = '';
  public isLoading: boolean = false;
  public unSubscribe = new Subject<void>();

  ngOnInit(): void {
    this.productService.deleteModalOpen
      .pipe(takeUntil(this.unSubscribe))
      .subscribe({ next: (res) => (this.isVisible = res) });
  }
  deleteProduct(isDelete: boolean): void {
    if (!isDelete) {
      this.productService.deleteModalOpen.next(false);
      return;
    }
    this.isLoading = true;
    this.productService.deleteProduct(this.productId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.isLoading = false;
          this.toast.success(res.message);
          this.router.navigate(['/seller/products']);
        } else {
          this.isLoading = false;
          this.toast.error(res.message);
        }
        this.productService.deleteModalOpen.next(false);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(err.message);
      },
    });
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
