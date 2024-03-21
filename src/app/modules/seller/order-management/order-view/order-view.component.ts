import { OrderService } from 'src/app/services/order/order.service';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import uikit from 'uikit';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { SellerStoreService } from 'src/app/shared/services/seller-store.service';
import { OrderAcceptRejectPayload, Refund } from 'src/app/models/order.model';
import { MatDialog } from '@angular/material/dialog';
import { RefundDetailsDialogComponent } from '../refund-details-dialog/refund-details-dialog.component';

declare var cloudinary: any;

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent implements OnInit {
  order: any;
  // complementaryProducts: any[] = [];
  // tempVariations: any[] = [];
  confirmOrderForm: FormGroup;
  variations: any[] = [];
  serialNumber: string = '';
  additionalInformation: string = '';
  rejectionReason: string = '';
  rejectingOrder: boolean;
  acceptingOrder: boolean = false;
  photoUrl: string = '';
  videoUrl: string;
  uploadWidget: any;
  uploadWidget2: any;
  videoName = '';
  scheduleTimes: string[] = [];
  currentDate: Date;
  maxDate: Date;
  isRefundRequested: boolean = false;
  refundData!: Refund;
  isRefundLoading: boolean = true;

  constructor(
    private appLocal: AppLocalStorage,
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private sellerStore: SellerStoreService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });

    this.getDetails();
    this.initMediaWidget();
    this.initVideoWidget();

    this.confirmOrderForm = new FormGroup({
      serialNumber: new FormControl(null),
      additionalDetails: new FormControl(null),
      startDate: new FormControl(null, [Validators.required]),
      pickupTime: new FormControl(null, Validators.required),
    });

    this.startDate.valueChanges.subscribe((value) => {
      if (value != null) {
        const dateTime: { actualDate: string; actualTime: string } =
          this.orderService.getDateAndTime(value);

        this.pickupTime.setValue(dateTime.actualTime);
      }
    });

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    this.currentDate = currentDate;

    this.maxDate = this.orderService.getMaxDate(this.currentDate);
  }

  get startDate() {
    return <FormControl>this.confirmOrderForm.get('startDate');
  }

  get pickupTime() {
    return <FormControl>this.confirmOrderForm.get('pickupTime');
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
      },
    );
  };

  initVideoWidget() {
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
      },
    );
  }

  upload(): void {
    this.uploadWidget.open();
  }

  uploadVideo(): void {
    this.uploadWidget2.open();
  }

  getDetails = () => {
    this.appLocal.messageSource.subscribe((res) => {
      if (res) {
        this.order = res;
        this.appLocal.storeToStorage('page_data', res);
      } else {
        this.order = this.appLocal.getFromStorage('page_data');
      }

      this.orderService.getOrder(this.order.id).subscribe((res) => {
        this.isRefundLoading = false;
        this.isRefundRequested = res['data'].isRefundRequested;
        this.refundData = res['data'].refund;
        if (res['data'].orderStatus.toLowerCase() === 'returned') {
          this.order['deliveryTrackingEvents'] = [
            ...res['data'].deliveryTrackingEvents,
            {
              dateTime: res['data'].refund.created,
              eventType: 'Customer',
              status: 'Returned',
              remark: 'Refund request accepted',
            },
          ];
        }
      });
      this.setVariation(this.order.cartProduct.varations);
    });
  };

  onSeeRefundDetails() {
    this.dialog.open(RefundDetailsDialogComponent, {
      panelClass: 'otp_dialog',
      width: '600px',
      data: { refund: this.refundData },
    });
  }

  getObjectByStatus(status: string): any {
    return (
      this.order?.deliveryTrackingEvents.find(
        (it) => it.status.toLowerCase() === status.toLowerCase(),
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

  closeRejectDialog = () => {
    document.getElementById('closeRejectOrderDialog').click();
  };

  onRemovePhoto() {
    this.photoUrl = '';
  }

  rejectOrder = () => {
    this.rejectingOrder = true;
    const payload: OrderAcceptRejectPayload = {
      orderId: this.order.id,
      photoUrl: '',
      videoUrl: '',
      serialNumber: '',
      additionalInformation: '',
      rejectionReason: this.rejectionReason,
      isConfirmed: false,
      pickupDate: '2024-01-05T04:20:39.842Z',
    };

    this.orderService.acceptRejectOrder(payload).subscribe({
      next: (res) => {
        this.rejectingOrder = false;
        this.toastr.success(res.message, 'SUCCESS');
        uikit.modal('#reject-modal').hide();
        this.router.navigate(['/seller/orders']);
        this.orderService.orderActionTaken.next(true);
      },
      error: (err) => {
        this.rejectingOrder = false;
        this.toastr.error('An error ocurred! Try again ');
      },
    });
  };

  acceptOrder = () => {
    if (!this.pickupTime.value || this.pickupTime.value == '') {
      this.toastr.warning('Select a pick up date and time for this order');
      return;
    }
    this.acceptingOrder = true;
    const formattedDate = this.orderService.formatDate(this.startDate.value);

    const isoString = this.orderService.formatDateToISO(
      formattedDate,
      this.pickupTime.value,
    );

    const payload = {
      orderId: this.order.id,
      photoUrl: this.photoUrl,
      videoUrl: this.videoUrl ?? '',
      serialNumber: this.serialNumber,
      additionalInformation: this.additionalInformation,
      rejectionReason: '',
      isConfirmed: true,
      pickupDate: isoString,
    };

    this.orderService.acceptRejectOrder(payload).subscribe({
      next: (res) => {
        uikit.modal('#accept-modal').hide();
        this.acceptingOrder = false;
        this.toastr.success(res.message, 'SUCCESS');
        this.router.navigate(['/seller/orders']);
        this.orderService.orderActionTaken.next(true);
      },
      error: (err) => {
        this.acceptingOrder = false;
      },
    });
  };
}
