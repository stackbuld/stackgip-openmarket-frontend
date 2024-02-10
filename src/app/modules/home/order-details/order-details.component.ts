import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from 'express';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { FooterService } from 'src/app/services/footer.service';
import { OrderService } from 'src/app/services/order/order.service';
import { RequestRefundModalComponent } from './request-refund-modal/request-refund-modal.component';
import { ProductsService } from '../../../services/products/products.service';
import { OrderDetail, OrderDetail2 } from '../../../models/order.model';
import { ProductOptions } from '../../../models/products.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order: OrderDetail2;
  // complementaryProducts: any[] = [];
  // tempVariations: any[] = [];
  variations: ProductOptions[] | any[] = [];
  serialNumber: string = '';
  additionalInformation: string = '';
  rejectionReason: string = '';
  rejectingOrder: boolean;
  acceptingOrder: boolean;
  photoUrl: string = '';
  videoUrl: string = '';
  uploadWidget: any;
  uploadWidget2: any;
  videoName = '';
  productDesc: string = '';
  refundRequested: boolean = false;
  isLoading: boolean = false;

  constructor(
    private appLocal: AppLocalStorage,
    private footerService: FooterService,
    private dialog: MatDialog,
    private productService: ProductsService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.footerService.setShowFooter(true);
    this.getDetails();
  }

  getDetails = () => {
    this.isLoading = true;
    this.appLocal.messageSource.subscribe((res) => {
      if (res) {
        this.order = res;
        this.appLocal.storeToStorage('page_data', res);
      } else {
        this.order = this.appLocal.getFromStorage('page_data');
      }
      this.productService.getProduct(this.order.productId).subscribe({
        next: (res) => {
          this.productDesc = res.data.description;
        },
      });
      this.orderService.getOrder(this.order.id).subscribe((res) => {
        this.isLoading = false;
        this.refundRequested = res['data'].isRefundRequested;
      });
      console.log(this.order);
      // for (let index = 0; index < this
      // .order.cartProduct.complementaryProducts.length; index++) {
      //   const element = this.order.cartProduct.complementaryProducts[index];
      //   if (element.isMultiple === true) {
      //     this.complementaryProducts.push(element);
      //   }
      //   if (element.isMultiple === false) {
      //     this.tempVariations.push(element);
      //   }
      // }
      try {
        this.setVariation(this.order.cartProduct.varations);
      } catch {}
    });
  };

  getObjectByStatus(status: string): any {
    return (
      this.order?.deliveryTrackingEvents.find(
        (it) => it.status.toLowerCase() === status.toLowerCase(),
      ) || null
    );
  }

  setVariation(list: any) {
    const groupedOptions: any[] = list.reduce((acc, option) => {
      const title = option.title;
      const existingOptions = acc[title] || [];
      return {
        ...acc,
        [title]: [...existingOptions, option],
      };
    }, {});
    const groupedOptionsArray = Object.values(groupedOptions);
    this.variations = groupedOptionsArray;
  }

  onRefundRequest() {
    const dialogRef = this.dialog.open(RequestRefundModalComponent, {
      data: {
        unit: this.order.unit,
        orderNumber: this.order.orderNo,
        productDesc: this.productDesc,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getDetails();
    });
  }
}
