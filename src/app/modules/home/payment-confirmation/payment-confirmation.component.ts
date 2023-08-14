import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { FooterService } from 'src/app/services/footer.service';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.scss']
})
export class PaymentConfirmationComponent implements OnInit {
  paymentStatus: boolean;
  loading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private applocal: AppLocalStorage,
    private footerService: FooterService,
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.paymentStatus = params['isPaymentSuccessful'];
      if (this.paymentStatus) {
        localStorage.removeItem('referenceId');
        this.applocal.cartCount.next(1);
        this.applocal.storeToStorage('cartCount', 1);
      }
    });
  }

  ngOnInit(): void {
    this.footerService.setShowFooter(true);
  }

}
