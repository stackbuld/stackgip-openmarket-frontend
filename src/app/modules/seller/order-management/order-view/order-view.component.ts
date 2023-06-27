import { OrderService } from 'src/app/services/order/order.service';
import { Component, OnInit, inject } from '@angular/core';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

declare var cloudinary: any;

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {
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
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.getDetails();
  }

  ngOnInit(): void {
    this.initMediaWidget();
    this.initVideoWidget();
  }

  initMediaWidget = () => {
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.photoUrl = result.info.secure_url;
        }
      }
    );
  }

  initVideoWidget () {
    this.uploadWidget2 = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        // clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.videoName = result.info.original_filename; 
          this.videoUrl = result.info.secure_url;
        }
      }
    );
  }

  upload(): void {
    this.uploadWidget.open();
  }

  uploadVideo(): void {
    this.uploadWidget2.open();
  }

  getDetails = () => {
    this.appLocal.messageSource.subscribe(res => {
      if(res) {
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
    })
  }

  getObjectByStatus(status: string): any {
    return this.order?.deliveryTrackingEvents.find(it => it.status.toLowerCase() === status.toLowerCase()) || null;
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

  closeRejectDialog = () => {
    document.getElementById('closeRejectOrderDialog').click();
  }

  closeAcceptDialog = () => {
    document.getElementById('closeAcceptOrderDialog').click();
  }

  rejectOrder = () => {
    this.rejectingOrder = true;
    const payload = {
      orderId: this.order.id,
      photoUrl: "",
      videoUrl: "",
      serialNumber: "",
      additionalInformation: "",
      rejectionReason: this.rejectionReason,
      isConfirmed: false
    }
    this.orderService.acceptRejectOrder(payload).subscribe(res => {
      if(res.status === 'success') {
        this.rejectingOrder = false;
        this.closeRejectDialog();
        this.toastr.success(res.message, 'SUCCESS');
        this.router.navigate(['/seller/orders']);
      } else {
        this.rejectingOrder = false;
        this.toastr.success(res.message, 'SUCCESS');
      }
    }, err => {
      this.rejectingOrder = false;
    })
  }

  acceptOrder = () => {
    this.acceptingOrder = true;
    const payload = {
      orderId: this.order.id,
      photoUrl: this.photoUrl,
      videoUrl: this.videoUrl,
      serialNumber: this.serialNumber,
      additionalInformation: this.additionalInformation,
      rejectionReason: this.rejectionReason,
      isConfirmed: true
    }
    this.orderService.acceptRejectOrder(payload).subscribe(res => {
      if(res.status === 'success') {
        this.acceptingOrder = false;
        this.closeAcceptDialog();
        this.toastr.success(res.message, 'SUCCESS');
        this.router.navigate(['/seller/orders']);
      } else {
        this.acceptingOrder = false;
        this.toastr.success(res.message, 'SUCCESS');
      }
    }, err => {
      this.acceptingOrder = false;
    })
  }

}
