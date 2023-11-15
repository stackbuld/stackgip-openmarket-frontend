import { Component } from '@angular/core';

@Component({
  selector: 'app-seller-storefront',
  templateUrl: './seller-storefront.component.html',
  styleUrls: ['./seller-storefront.component.scss'],
})
export class SellerStorefrontComponent {
  ratings = 4;
  activeTab: string = 'products'; // default tab
  products = document.querySelector('.products');
  about = document.querySelector('.about');

  selectTab(tab: string) {
    this.activeTab = tab;
    // if (tab === 'products') {
    //   this.products.classList.remove('hide');
    //   this.products.classList.add('show');
    //   this.about.classList.remove('show');
    //   this.about.classList.add('hide');
    // } else if (tab === 'about') {
    //   this.products.classList.remove('show');
    //   this.products.classList.add('hide');
    //   this.about.classList.remove('hide');
    //   this.about.classList.add('show');
    // }
  }
}
