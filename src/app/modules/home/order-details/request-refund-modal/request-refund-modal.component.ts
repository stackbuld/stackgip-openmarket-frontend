import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {
    RefundPayload,
    RefundService,
} from 'src/app/services/refund/refund.service';
import {environment} from 'src/environments/environment';

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
    isLoading: boolean = false;

    constructor(
        private dialog: MatDialog,
        private refundService: RefundService,
        @Inject(MAT_DIALOG_DATA) private data: { unit: number; orderNumber: string }
    ) {
    }

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
                }
            );
        } catch {
        }
    }

    onRefund() {
        if (this.mediaUrl == '' || this.selectedReason == '') {
            return;
        }
        this.isLoading = true
        const payload: RefundPayload = {
            orderNumber: this.data.orderNumber,
            unit: this.data.unit,
            refundReason: this.selectedReason,
            imageUrls: ['peg', 'jpg', 'png'].includes(this.mediaType)
                ? [this.mediaUrl]
                : [],
            videoUrl: ['gif', 'mp4'].includes(this.mediaType) ? [this.mediaUrl] : [],
        };

        this.refundService.requestRefund(payload).subscribe({
            next: (res) => {
                console.log(res);
                if (res.succeeded) {
                    this.isLoading = false
                    this.onCloseModal()
                }
            },
            error: (err) => {
                this.isLoading = false
            },
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
