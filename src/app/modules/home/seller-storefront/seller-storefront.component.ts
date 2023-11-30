import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISeller } from 'src/app/models/sellerModel';
import { SellerStorefrontService } from 'src/app/services/seller-storefront/seller-storefront.service';

@Component({
  selector: 'app-seller-storefront',
  templateUrl: './seller-storefront.component.html',
  styleUrls: ['./seller-storefront.component.scss'],
})
export class SellerStorefrontComponent implements OnInit {
  ratings = 4;
  activeTab: string = 'products'; // default tab
  sellerId: string = '';
  loadingData: boolean = true;

  tempVariable: string;

  sellerStorefrontDetails: ISeller;
  // productsDiv = document.querySelector('.products');
  // aboutDiv = document.querySelector('.about');

  constructor(
    private route: ActivatedRoute,
    private sellerStorefrontService: SellerStorefrontService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.sellerId = params.get('sellerId');
    });

    this.sellerStorefrontService
      .getSellerStorefrontDetails(this.sellerId)
      .subscribe((data) => {
        this.sellerStorefrontDetails = data.data;
        this.tempVariable =
          !this.sellerStorefrontDetails.coverPhotoUrl ||
          this.sellerStorefrontDetails.coverPhotoUrl === 'string'
            ? 'assets/img/Storefront-frame.png'
            : this.sellerStorefrontDetails.coverPhotoUrl;
        this.loadingData = false;
        console.log('SELLER STOREFRONT DETAILS', data);
      });
  }

  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    this.toaster.success('Link copied to clipboard');
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
