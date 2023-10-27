import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterService } from 'src/app/services/footer.service';

@Component({
  selector: 'app-product-add-to-cart',
  templateUrl: './product-add-to-cart.component.html',
  styleUrls: ['./product-add-to-cart.component.scss'],
})
export class ProductAddToCartComponent implements OnInit, OnDestroy {
  constructor(private footerService: FooterService) {}

  ngOnInit(): void {
    this.footerService.setShowFooter(true);
  }
  ngOnDestroy(): void {}
}
