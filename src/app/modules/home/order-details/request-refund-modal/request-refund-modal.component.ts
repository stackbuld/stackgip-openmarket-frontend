import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  RefundPayload,
  RefundService,
} from 'src/app/services/refund/refund.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ImageResolutionUtility } from '../../../../helpers/image-resolution.utility';

declare var cloudinary: any;

enum Reasons {
  'Item stopped working' = 'Item_stopped_working',
  'Packaging was damaged' = 'Packaging_was_damaged',
  'Item received broken or damaged' = 'Item_received_broken_or_damaged',
  'Item seem to be fake and unauthentic' = 'Item_seem_to_be_fake_and_unauthentic',
}

@Component({
  selector: 'app-request-refund-modal',
  templateUrl: './request-refund-modal.component.html',
  styleUrls: ['./request-refund-modal.component.scss'],
})
export class RequestRefundModalComponent implements OnInit {
  refundReasons: string[] = [
    'I changed my mind',
    'Item stopped working',
    'Packaging was damaged',
    'Item received broken or damaged',
    'Item seem to be fake and unauthentic',
  ];
  uploadWidget: any;
  mediaUrl: string = '';
  mediaType: string;
  selectedReason: string = '';
  refundUnit: number = 0;
  isLoading: boolean = false;
  productDesc: string = '';

  constructor(
    private dialog: MatDialog,
    private refundService: RefundService,
    @Inject(MAT_DIALOG_DATA)
    private data: { unit: number; orderNumber: string; productDesc: string },
    private toast: ToastrService,
  ) {}

  ngOnInit(): void {
    try {
      this.uploadWidget = cloudinary.createUploadWidget(
        {
          cloudName: environment.cloudinaryName,
          uploadPreset: environment.cloudinaryUploadPerset,
          clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif', 'mp4'],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            this.mediaUrl = result.info.secure_url;
            this.mediaType = this.mediaUrl.slice(-3);
          }
        },
      );
    } catch {}

    this.productDesc = this.data.productDesc;
    this.refundUnit = this.data.unit;
  }

  onRefund() {
    if (this.refundUnit > this.data.unit) {
      this.toast.error('Units can not be more than product unit!');
      return;
    }
    if (
      this.mediaUrl == '' ||
      this.selectedReason == '' ||
      this.refundUnit == 0
    ) {
      return;
    }
    this.isLoading = true;
    const payload: RefundPayload = {
      orderNumber: this.data.orderNumber,
      unit: this.data.unit,
      refundReason: Reasons[this.selectedReason],
      imageUrls: ['peg', 'jpg', 'png'].includes(this.mediaType)
        ? [this.mediaUrl]
        : [],
      videoUrl: ['gif', 'mp4'].includes(this.mediaType) ? this.mediaUrl : '',
    };

    this.refundService.requestRefund(payload).subscribe({
      next: (res) => {
        if (res.succeeded) {
          this.isLoading = false;
          this.onCloseModal();
          this.toast.success('Refund request made successfully!');
        } else {
          this.isLoading = false;
          this.toast.error(res.errors[0]);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(
          err.error.message ? err.error.message : 'Something went wrong!',
        );
      },
    });
  }

  getImageResolution() {
    return ImageResolutionUtility.getImageResolution(this.mediaUrl, 700, 140);
  }

  onUploadMedia() {
    this.uploadWidget.open();
  }

  onRemoveMedia() {
    this.mediaUrl = '';
    this.mediaType = null;
  }

  onCloseModal() {
    this.dialog.closeAll();
  }
}
