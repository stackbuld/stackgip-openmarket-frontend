import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ISeller } from 'src/app/models/sellerModel';
import { SellerStorefrontService } from 'src/app/services/seller-storefront/seller-storefront.service';
import { ImageResolutionUtility } from 'src/app/helpers/image-resolution.utility';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WindowRefService } from 'src/app/shared/services/window.service';

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
  bannerImgUrl: string = '';
  logoImgUrl: string = '';

  defaultBannerUrl: string =
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1702892561/seller-store-default_eptfpw.jpg';
  defaultLogoImgUrl: string =
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1702892615/store-logo_isqyts.png';

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

    let unchangedBannerUrl: string;

    this.sellerStorefrontService
      .getSellerStorefrontDetails(this.sellerId)
      .subscribe((data) => {
        this.sellerStorefrontDetails = data.data;
        this.bannerImgUrl =
          !this.sellerStorefrontDetails.coverPhotoUrl ||
          this.sellerStorefrontDetails.coverPhotoUrl === 'string'
            ? this.defaultBannerUrl
            : this.sellerStorefrontDetails.coverPhotoUrl;

        unchangedBannerUrl = this.bannerImgUrl;

        this.logoImgUrl = !this.sellerStorefrontDetails.profileImageUrl
          ? this.defaultLogoImgUrl
          : this.sellerStorefrontDetails.profileImageUrl;

        this.bannerImgUrl = this.getImageResolution(
          this.bannerImgUrl,
          1200,
          300
        );

        this.logoImgUrl = this.getImageResolution(this.logoImgUrl, 300, 300);
        this.loadingData = false;
      });
  }

  copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    this.toaster.success('Link copied to clipboard');
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  };
}
