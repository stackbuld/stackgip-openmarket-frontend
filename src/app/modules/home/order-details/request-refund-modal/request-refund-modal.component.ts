import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private dialog: MatDialog) {}

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
