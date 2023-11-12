import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-storefront',
  templateUrl: './seller-storefront.component.html',
  styleUrls: ['./seller-storefront.component.scss'],
})
export class SellerStorefrontComponent {
  ratings = 4;
  activeTab: string = 'products'; // default tab

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
