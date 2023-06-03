import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageResolutionUtility } from 'src/app/helpers/image-resolution.utility';
import { AppLocalStorage } from 'src/app/helpers/local-storage';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(
    private appLocal: AppLocalStorage,
    private router: Router,
  ) { }

  view = (item: any) => {
    this.appLocal.messageSource.next(item);
    this.appLocal.productViewed.next('productViewed');
    this.router.navigate([`/homepage/product/${item.id}`]);
  }

  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  }
}
