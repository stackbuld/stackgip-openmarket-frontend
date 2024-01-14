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
  mediaUrl: string;

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
          console.log(this.mediaUrl);
        }
      }
    );
  }

  onUploadMedia() {
    this.uploadWidget.open();
  }

  onCloseModal() {
    this.dialog.closeAll();
  }
}
