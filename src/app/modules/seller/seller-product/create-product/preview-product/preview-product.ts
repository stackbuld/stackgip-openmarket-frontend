import { ProductsService } from 'src/app/services/products/products.service';
import { SafeHtmlPipe } from '../../../../../shared/pipes/safehtml.pipe';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import uikit from 'uikit';

@Component({
  selector: 'app-preview-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-product.html',
  providers: [SafeHtmlPipe],
})
export class ProductPreview {
  previewDesc: SafeHtml;
  creatingProduct: boolean = false;
  loading: boolean = false;

  @Input() productId: number | null = null;
  @Input() previewData: any = Object.create(null);
  @Input() form!: FormGroup;
  @Input() videoUrls: string[] = [];
  @Input() relatedItems: any[] = [];
  @Input() allVariantList: any[] = [];
  @Input() uniqueVariant: any[] = [];
  @Input() complementaryImagesStore: any[] = [];
  @Output() complementaryImagesStoreChange = new EventEmitter<any[]>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onChangeUnit = new EventEmitter<{ unit: number; type: string }>();

  constructor(
    private productService: ProductsService,
    private safeHtml: SafeHtmlPipe,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.previewDesc = this.safeHtml.transform(this.form.value.description);
  }

  changeUnit(unit: number, type: string): void {
    this.onChangeUnit.emit({ unit, type });
  }

  edit(): void {
    this.onEdit.emit();
  }

  createProduct = () => {
    this.creatingProduct = true;

    this.productService
      .createNewProduct({
        ...this.form.value,
        videoUrls: [...this.videoUrls],
        options: [...this.relatedItems, ...this.allVariantList],
        publishOption: 'Review',
      })
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toast.success('Product added successfully');
            this.router.navigate(['/seller/products']);

            this.creatingProduct = false;
            localStorage.removeItem('compImagesStore');
            this.complementaryImagesStore = [];
          } else {
            this.creatingProduct = false;
            this.toast.error('Something went wrong');
          }
        },
        error: (err) => {
          this.creatingProduct = false;
          this.toast.error('Something went wrong');
        },
      });
  };

  updateProduct = () => {
    this.creatingProduct = true;
    this.productService
      .createNewProduct({
        ...this.form.value,
        videoUrls: this.videoUrls,
        options: [...this.relatedItems, ...this.allVariantList],
        publishOption: 'Review',
        draftProductId: this.productId,
      })
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toast.success('Product updated successfully!');
            this.router.navigate(['/seller/products']);
            this.creatingProduct = false;
            localStorage.removeItem('compImagesStore');
            this.complementaryImagesStore = [];
          } else {
            this.creatingProduct = false;
            this.toast.error(res.message);
          }
        },
        error: (err) => {
          this.creatingProduct = false;
          this.toast.error(err.message);
        },
      });
  };

  deleteProduct(): void {
    uikit.modal.confirm('Are you sure that you want to delete product ?').then(
      () => {
        this.loading = true;
        this.productService.deleteProduct(this.productId).subscribe((res) => {
          if (res.status === 'success') {
            this.loading = false;
            this.toast.success(res.message);
            this.router.navigate(['/seller/products']);
          } else {
            this.loading = false;
            this.toast.error(res.message);
          }
        });
      },
      (err) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }
}
