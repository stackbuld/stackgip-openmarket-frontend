import { ProductsService } from 'src/app/services/products/products.service';
import { SafeHtmlPipe } from '../../../../../shared/pipes/safehtml.pipe';
import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import uikit from 'uikit';
import { CreateProductDto } from 'src/app/models/products.model';

@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.html',
  styleUrls: ['./preview-product.scss'],
})
export class ProductPreview {
  previewDesc: SafeHtml;
  creatingProduct: boolean = false;
  loading: boolean = false;
  isVisible: boolean = false;

  @Input() productId: string | null = null;
  @Input() previewData: any = Object.create(null);
  @Input() form!: FormGroup;
  @Input() selectedCategoryId: string = '';
  @Input() videoUrls: string[] = [];
  @Input() relatedItems: any[] = [];
  @Input() allVariantList: any[] = [];
  @Input() uniqueVariant: any[] = [];
  @Input() complementaryImagesStore: any[] = [];
  @Output() complementaryImagesStoreChange = new EventEmitter<any[]>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onChangeUnit = new EventEmitter<{ unit: number; type: string }>();

  constructor(
    public productService: ProductsService,
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
    const model: CreateProductDto = {
      ...this.form.value,
      createdByAdmin: false,
      categoryId: this.selectedCategoryId ?? this.form.value.category.id,
      videoUrls: this.videoUrls,
      options: [...this.relatedItems, ...this.allVariantList],
      publishOption: 'Review',
    };
    this.productService.createNewProduct(model).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toast.success('Product created', 'Success');
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
      .updateProduct(
        {
          ...this.form.value,
          categoryId: this.selectedCategoryId ?? this.form.value.category.id,
          videoUrls: this.videoUrls,
          options: [...this.relatedItems, ...this.allVariantList],
          publishOption: 'Review',
          draftProductId: this.productId,
        },
        this.productId
      )
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

  openDeleteModal(): void {
    this.productService.deleteModalOpen.next(true);
  }
}
