import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  RefundPayload,
  RefundService,
} from 'src/app/services/refund/refund.service';
import { environment } from 'src/environments/environment';
declare var cloudinary: any;

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

  constructor(
    private dialog: MatDialog,
    private refundService: RefundService,
    @Inject(MAT_DIALOG_DATA) private data: { unit: number; productId: string }
  ) {}

  ngOnInit(): void {
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif', 'mp4'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.mediaUrl = result.info.secure_url;
          this.mediaType = this.mediaUrl.slice(-3);
        }
      }
    );
    console.log(this.selectedReason);
  }

  onRefund() {
    if (this.mediaUrl == '' || this.selectedReason == '') {
      return;
    }

    const payload: RefundPayload = {
      orderNumber: this.data.productId,
      unit: this.data.unit,
      refundReason: this.selectedReason,
      imageUrls:
        this.mediaType == 'peg' || 'png' || 'jpg' ? [this.mediaUrl] : [],
      videoUrl: this.mediaType == 'mp4' || 'gif' ? [this.mediaUrl] : [],
    };

    this.refundService.requestRefund(payload).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
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
