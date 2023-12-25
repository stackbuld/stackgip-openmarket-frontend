import { IUser } from '../../../../models/IUserModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ProductModel } from '../../../../models/products.model';
import { ProductsService } from '../../../../services/products/products.service';
import { ToastrService } from '../../../../services/toastr.service';

import { numberWithCommas } from '../../../../helpers/number-format';
import { formatDateToLocal } from '../../../../helpers/date-format';
import uikit from 'uikit';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Output() productIdSend = new EventEmitter();
  @Output() viewedMore = new EventEmitter();
  numberWithCommas: Function = numberWithCommas;
  user = {} as IUser;
  productDetails: ProductModel[] = [];
  formatDateToLocal: Function;
  productSort: string = 'Date'; //Date or UnitSold
  byAscending: boolean = false;
  pageNumber: number;
  totalItemCount: number;
  maximumItem: number = 10;
  defaultPage: number = 1;
  keyword: string = '';
  category: string = '';
  type: string = 'All'; //All or Custom
  startDate: string = '';
  endDate: string = '';
  minValue: number = 0;
  maxValue: number = 500000000000;
  loading: boolean;
  loadingStock: boolean;
  loadingOverview: boolean;
  lowStock: any;
  overview: any;
  stockForm: FormGroup;
  selectedStock: any;
  tab = 1;
  draftProductDetails: ProductModel[] = [];
  lowStockTotal: number = 0;
  lowStockDefaultPageNumber: number = 1;
  lowStockPageNumber: number = 1;
  lowStockMaxItem: number = 10;
  lowStockTotalItem: number;

  constructor(
    private productService: ProductsService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.formatDateToLocal = formatDateToLocal;
    this.user = this.authService.getLoggedInUser();
  }

  ngOnInit(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
    this.fetchNextProducts(this.defaultPage);
    this.getLowStockProducts(this.lowStockDefaultPageNumber);
    this.getProductsOverview();
    this.initStockForm();
  }

  getLowStockProducts(pageNumber: number) {
    this.loadingStock = true;

    this.lowStockPageNumber = pageNumber;

    this.productService
      .getLowStockProducts({
        userId: this.user.id,
        pageNumber: pageNumber,
        maxItem: this.lowStockMaxItem,
      })
      .subscribe((res) => {
        this.loadingStock = false;
        this.lowStockTotal = res.data.pager.totalItemCount;
        this.lowStock = res.data.data;
        this.lowStockTotalItem = res.data.pager.totalItemCount;
      });
  }

  getProductsOverview() {
    this.loadingOverview = true;
    this.productService.getProductsOverviewPerUser(this.user.id).subscribe(
      (res) => {
        this.loadingOverview = false;
        this.overview = res.data;
      },
      (err) => {
        this.loadingOverview = false;
      }
    );
  }

  // onDelete(productId: number): void {
  //   uikit.modal.confirm("Are you sure that you want to remove this ?").then(
  //     () => {
  //       // this.productService.deleteProduct(productId).subscribe((a) => {
  //       //   this.productDetails = this.productDetails.filter(
  //       //     (b) => b.id !== productId
  //       //   );
  //       // });
  //       this.toast.success("product removed successfullysss");
  //     },
  //     () => {}
  //   );
  // }

  public addProduct(product: ProductModel): void {
    this.productDetails.push(product);
  }

  public updateProduct(product: ProductModel): void {
    const index = this.productDetails.findIndex((p) => p.id === product.id);

    this.productDetails[index] = product;
  }

  setProductId(productId: string): void {
    this.productIdSend.emit({ productId });
  }

  setViewMore(productId: string): void {
    this.viewedMore.emit({ productId });
  }

  fetchNextProducts(pageNumber: number, productStatus?: string | null) {
    this.loading = true;
    this.productService
      .getSellerProducts(
        this.user.id,
        pageNumber,
        this.maximumItem,
        this.keyword,
        this.category,
        this.minValue,
        this.maxValue,
        this.type,
        this.startDate,
        this.endDate,
        this.productSort,
        this.byAscending,
        productStatus
      )
      .subscribe({
        next: (productDetail) => {
          this.loading = false;
          this.productDetails = productDetail.data.data;
          console.log(this.productDetails);

          this.pageNumber = productDetail.data.pager.pageNumber;
          this.totalItemCount = productDetail.data.pager.totalItemCount;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  onSearch(data): void {
    this.keyword = data.keyword;
    this.category = data.category;
    this.startDate = data.startDate ? data.startDate.toLocaleDateString() : '';
    this.endDate = data.endDate ? data.startDate.toLocaleDateString() : '';
    this.minValue = data.minValue;
    this.maxValue = data.maxValue;
    if (this.startDate !== '') {
      this.type = 'Custom';
    }
    this.fetchNextProducts(this.defaultPage);
  }

  onPageSizeChange(e: any) {
    if (e.target.value !== '') {
      this.maximumItem = e.target.value;
      this.fetchNextProducts(this.defaultPage);
    }
  }

  onLowStockPageSizeChange(e: any) {
    if (e.target.value !== '') {
      this.lowStockMaxItem = e.target.value;
      this.getLowStockProducts(this.lowStockDefaultPageNumber);
    }
  }

  onSearchClear(data): void {
    this.keyword = '';
    this.category = '';
    this.startDate = '';
    this.endDate = '';
    this.minValue = 0;
    this.maxValue = 500000000000;
    this.fetchNextProducts(this.defaultPage);
  }

  sortBy(field: string, asc: boolean = true): void {
    this.productSort = field;
    this.byAscending = asc;
    this.fetchNextProducts(this.defaultPage);
  }

  initStockForm(): void {
    this.stockForm = this.fb.group({
      unit: ['', [Validators.required]],
    });
  }

  setSelectedstock(item: any) {
    this.selectedStock = item;
  }

  getDrafts() {
    this.loading = true;
    this.fetchNextProducts(this.defaultPage, 'Draft');
  }

  getPublished() {
    this.loading = true;
    this.fetchNextProducts(this.defaultPage, 'Published');
  }

  getRejected() {
    this.loading = true;
    this.fetchNextProducts(this.defaultPage, 'Rejected');
  }

  updateStockUnit(): void {
    if (this.stockForm.value.unit > this.selectedStock.unit) {
      this.productService
        .updateProductUnit(this.selectedStock.id, this.stockForm.value)
        .subscribe(
          (res) => {
            if (res.status === 'success') {
              this.document.getElementById('closeStockModalBtn').click();
              this.loadingStock = false;
              this.toast.success(res.message);
              this.getLowStockProducts(this.lowStockDefaultPageNumber);
              this.initStockForm();
            } else {
              this.loadingStock = false;
              this.toast.error(res.message);
            }
          },
          (err) => {
            this.loadingStock = false;
            this.toast.error(err.message);
          }
        );
    } else if (this.stockForm.value.unit === 0) {
      this.toast.error(`Prouct Unit can not be zero.`);
    } else {
      this.toast.error(`Prouct Unit can not be less than current unit.`);
    }
    // if (unit >= 0) {
    // uikit.modal.confirm(`Are you sure you want to update <strong>${product.name}</strong> unit ?`).then(
    //   () => {
    //     this.loadingStock = true;
    //     const payload = {
    //       unit: unit
    //     }
    //     this.productService.updateProductUnit(product.id, payload).subscribe((res) => {
    //       if (res.status === 'success') {
    //         this.loadingStock = false;
    //         this.toast.success(res.message);
    //         this.getLowStockProducts();
    //       } else {
    //         this.loadingStock = false;
    //         this.toast.error(res.message);
    //       }
    //     });
    //   },
    //   (err) => {
    //     this.loadingStock = false;
    //     this.toast.error(err.message);
    //   }
    // );
    // } else {
    //   this.toast.error(`Prouct Unit is already zero.`);
    // }
  }

  // sortByUnitLeft(reverse:boolean = false):void{
  //   this.productDetails.sort((a:ProductModel,b:ProductModel)=>{
  //     if(reverse){
  //       return b.unit - a.unit
  //     }
  //     return a.unit - b.unit
  //   })
  // }
}
