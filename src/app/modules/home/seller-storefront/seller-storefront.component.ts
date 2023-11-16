import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-seller-storefront',
  templateUrl: './seller-storefront.component.html',
  styleUrls: ['./seller-storefront.component.scss'],
})
export class SellerStorefrontComponent implements OnInit {
  ratings = 4;
  activeTab: string = 'products'; // default tab
  sellerId: string = '';
  // productsDiv = document.querySelector('.products');
  // aboutDiv = document.querySelector('.about');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.sellerId = params.get('sellerId');
      console.log('SELLER ID FROM PARAMS', this.sellerId);
    });
    // const sellerId = JSON.parse(localStorage.getItem('userId'));
    // console.log('SELLER ID FROM LOCAL STORAGE', localStorage.getItem('userId'));
  }

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
