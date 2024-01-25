import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
})
export class EmailDialogComponent implements OnInit {
  email: string;
  resendTimer: number = 29;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { email: string },
    private authService: AuthService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.email = this.data.email;

    let timer = 29;

    setInterval(() => {
      timer = timer - 1;
      if (timer >= 0) {
        this.resendTimer = timer;
      }
    }, 1000);
  }

  onCloseEmailDialog() {
    this.dialog.closeAll();
  }

  onResendConfirmationEmail() {
    this.authService.resendConfirmationEmail(this.email).subscribe({
      next: (data) => {
        this.toast.success('Confirmation email resent successfully!');
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }
}
