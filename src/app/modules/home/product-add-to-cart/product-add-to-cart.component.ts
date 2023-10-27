import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from 'src/app/models/products.model';
import { FooterService } from 'src/app/services/footer.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-add-to-cart',
  templateUrl: './product-add-to-cart.component.html',
  styleUrls: ['./product-add-to-cart.component.scss'],
})
export class ProductAddToCartComponent implements OnInit, OnDestroy {
  test: boolean = true;
  product!: ProductModel;
  productId!: string;
  productPrice!: number;
  productUnit: number = 1;
  isUpdatingUnit: boolean = false;
  productVariations: any[] = [];
  allVariationsList: any[] = [];
  complimentaryProducts: any[] = [];
  selectedVariations: any[] = [];
  constructor(
    private footerService: FooterService,
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.footerService.setShowFooter(true);

    this.route.params.subscribe((param) => {
      this.productId = param['id'];
      this.getProductDetails(this.productId);
    });
  }

  getProductDetails(id: string) {
    this.productService.getCachedProductById(id).subscribe({
      next: (res) => {
        console.log(res.data);
        this.product = res.data;
        this.productPrice = res.data.price;

        for (let index = 0; index < res.data.productOptions.length; index++) {
          const element = res.data.productOptions[index];
          if (element.isMultiple === false) {
            element.isSelected = false;
            this.allVariationsList.push(element);
          }
          if (element.isMultiple === true) {
            element.isSelected = false;
            this.complimentaryProducts.push(element);
          }
        }

        this.setVariation(this.allVariationsList);
      },
      error: (err) => console.log(err),
    });
  }

  onUpdateProductUnit(type: string) {
    if (type === 'add') {
      this.productUnit++;
      this.isUpdatingUnit = true;
      this.productService.updateProductUnit(this.productId, 2).subscribe({
        next: (data) => {},
        error: (err) => {},
      });
    } else if (type === 'remove') {
      this.isUpdatingUnit = true;

      this.productUnit--;
    }
  }

  setVariation(list: any) {
    const groupedOptions = list.reduce((acc, option) => {
      const title = option.title;
      const existingOptions = acc[title] || [];
      console.log(existingOptions);

      return {
        ...acc,
        [title]: [...existingOptions, option],
      };
    }, {});

    const groupedOptionsArray = Object.values(groupedOptions);
    this.productVariations = groupedOptionsArray;
  }

  setSelectedVariation = (item: any) => {
    const matchingItem = this.allVariationsList.find(
      (element) => element.id === item.id
    );

    if (matchingItem) {
      const matchingIndex = this.selectedVariations.findIndex(
        (selected) => selected.id === item.id
      );

      const matchingTitleIndex = this.selectedVariations.findIndex(
        (selected) => selected.title === item.title
      );

      if (matchingIndex >= 0) {
        // item already in selectedVariations, remove it
        matchingItem.isSelected = false;
        this.selectedVariations.splice(matchingIndex, 1);
        this.productPrice = this.productPrice - matchingItem.cost;
        console.log(this.selectedVariations);
      } else if (matchingTitleIndex >= 0) {
        // item not in selectedVariations but same title already exists, remove the old one and add the new one
        const oldItem = this.selectedVariations[matchingTitleIndex];
        this.productPrice = this.productPrice - oldItem.cost;
        oldItem.isSelected = false;
        this.selectedVariations.splice(matchingTitleIndex, 1, matchingItem);
        this.productPrice = this.productPrice + matchingItem.cost;
        matchingItem.isSelected = true;
      } else {
        // item not in selectedVariations, add it
        matchingItem.isSelected = true;
        this.productPrice = this.productPrice + matchingItem.cost;
        this.selectedVariations.push(matchingItem);
        console.log(this.selectedVariations);
      }
    }
  };
  ngOnDestroy(): void {}
}
