import { Component, OnInit } from '@angular/core';
import { Router } from 'express';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { FooterService } from 'src/app/services/footer.service';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  // complementaryProducts: any[] = [];
  // tempVariations: any[] = [];
  variations: any[] = [];
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

  constructor(
    private appLocal: AppLocalStorage,
    private footerService: FooterService
  ) {}

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.footerService.setShowFooter(true);
    this.getDetails();
  }

  getDetails = () => {
    this.appLocal.messageSource.subscribe((res) => {
      if (res) {
        this.order = res;
        this.appLocal.storeToStorage('page_data', res);
      } else {
        this.order = this.appLocal.getFromStorage('page_data');
      }
      // for (let index = 0; index < this.order.cartProduct.complementaryProducts.length; index++) {
      //   const element = this.order.cartProduct.complementaryProducts[index];
      //   if (element.isMultiple === true) {
      //     this.complementaryProducts.push(element);
      //   }
      //   if (element.isMultiple === false) {
      //     this.tempVariations.push(element);
      //   }
      // }
      this.setVariation(this.order.cartProduct.varations);
    });
  };

  getObjectByStatus(status: string): any {
    return (
      this.order?.deliveryTrackingEvents.find(
        (it) => it.status.toLowerCase() === status.toLowerCase()
      ) || null
    );
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
    this.variations = groupedOptionsArray;
  }
}
