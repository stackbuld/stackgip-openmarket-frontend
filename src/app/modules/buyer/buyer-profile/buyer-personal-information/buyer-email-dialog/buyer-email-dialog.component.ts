import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-buyer-email-dialog',
  templateUrl: './buyer-email-dialog.component.html',
  styleUrls: ['./buyer-email-dialog.component.scss'],
})
export class BuyerEmailDialogComponent {
  email: string;
  resendTimer: number = 29;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { email: string },
    private authService: AuthService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.email = this.data.email;

    this.resendTimerFunc();
  }

  resendTimerFunc() {
    let timer = 29;

    setInterval(() => {
      timer = timer - 1;
      if (timer >= 0) {
        this.resendTimer = timer;
      }
    }, 1000);
  }

  onResendConfirmationEmail() {
    this.authService.resendConfirmationEmail(this.email).subscribe({
      next: (data) => {
        this.resendTimer = 29;
        this.resendTimerFunc();
        this.toast.success('Confirmation email resent!');
      },
      error: (err) => {
        this.toast.error(err.error.message);
      },
    });
  }
}
