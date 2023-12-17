import uikit from 'uikit';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from 'src/app/services/products/products.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  loading = false;
  loadingSummary: any;
  previewImg: string;
  id: any;
  product: any;
  variationList: any[] = [];
  user: any;
  orderDetails: any;
  variation: any;
  complimentartProducts: any[] = [];
  isFullDescription = false;
  hasFullDesc: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastservice: ToastrService,
    private router: Router,
    private productService: ProductsService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
    this.user = JSON.parse(localStorage.getItem('user'));

    this.activatedRoute.params.subscribe((param) => {
      this.id = param['id'];
      this.getProduct(param['id']);
      this.getProductOrderSummary();
    });
  }

  getProduct(id: string) {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.loading = false;

          this.product = res.data;

          this.previewImg = this.product.productImages[0];
          let variations = [];

          for (
            let index = 0;
            index < this.product.productOptions.length;
            index++
          ) {
            const element = this.product.productOptions[index];

            if (element.isMultiple === true) {
              this.complimentartProducts.push(element);
            }

            if (element.isMultiple === false) {
              variations.push(element);
            }
          }

          this.setVariation(variations);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastservice.error(err.message);
      },
    });
  }

  setVariation(list: any) {
    const groupedOptions = list.reduce((acc, option) => {
      const title = option.title;
      const existingOptions = acc[title] || [];

      return {
        ...acc,
        [title]: [...existingOptions, option],
      };
    }, {});

    const groupedOptionsArray = Object.values(groupedOptions);
    this.variationList = groupedOptionsArray;
  }

  getProductOrderSummary() {
    this.loadingSummary = true;
    this.productService.productOrderSummary(this.user.id, this.id).subscribe({
      next: (res) => {
        this.orderDetails = res.data;

        this.loadingSummary = false;
      },
      error: (err) => {
        this.loadingSummary = false;
        this.toastservice.error(err.message);
      },
    });
  }

  toggleDescription() {
    this.isFullDescription = !this.isFullDescription;
  }

  convertInnerHtmlToString(myHTML: any) {
    var strippedHtml = myHTML.replace(/<[^>]+>/g, '');
    if (strippedHtml.length > 700) {
      this.hasFullDesc = true;
    } else {
      this.hasFullDesc = false;
    }
    return strippedHtml;
  }

  updateStockUnit(product: any, unit: any): void {
    if (unit >= 0) {
      uikit.modal
        .confirm(
          `Are you sure you want to update <strong>${product.name}</strong> unit ?`
        )
        .then(
          () => {
            this.loading = true;
            const payload = {
              unit: unit,
            };
            this.productService
              .updateProductUnit(product.id, payload)
              .subscribe((res) => {
                if (res.status === 'success') {
                  this.loading = false;
                  this.toastservice.success(res.message);
                  this.getProduct(this.id);
                } else {
                  this.loading = false;
                  this.toastservice.error(res.message);
                }
              });
          },
          (err) => {
            this.loading = false;
            this.toastservice.error(err.message);
          }
        );
    } else {
      this.toastservice.error(`Prouct Unit is already zero.`);
    }
  }

  deleteProduct(productId: number): void {
    uikit.modal.confirm('Are you sure that you want to delete product ?').then(
      () => {
        this.loading = true;
        this.productService.deleteProduct(productId).subscribe((res) => {
          if (res.status === 'success') {
            this.loading = false;
            this.toastservice.success(res.message);
            this.router.navigate(['/seller/products']);
          } else {
            this.loading = false;
            this.toastservice.error(res.message);
          }
        });
      },
      (err) => {
        this.loading = false;
        this.toastservice.error(err.message);
      }
    );
  }

  showImg(img: string) {
    this.previewImg = img;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
