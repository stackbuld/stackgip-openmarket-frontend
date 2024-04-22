import { Component } from '@angular/core';
import {
  PromotedProduct,
  RecommendedProduct,
} from 'src/app/models/products.model';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { ICategory } from 'src/app/models/CategoryModels';
import { PromotedProductsService } from 'src/app/services/promoted-products/promoted-products.service';
import { RecommendedProductService } from 'src/app/services/recomended-product/recommended-product.service';
import { ImageResolutionUtility } from 'src/app/helpers/image-resolution.utility';
import { ProductSearchService } from '../../../services/seller/product-search.service';
import { ProductsService } from '../../../services/products/products.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  promotedProducts: PromotedProduct[] = [];
  recommendedProducts: RecommendedProduct[] = [];

  loadingPromotedProducts = true;
  loadingRecommendedProducts = true;

  categoryListLimit: number = 6;
  categoryMoreLimit: number = 6;

  isCategoryFilter: boolean = false;
  isCategorySearchFocused: boolean = false;

  categories: ICategory[] = [];
  categoryName: string = '';

  heroSlides = [
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1709820944/renamarket-website-files/Homepage/Carousel/bniyjbnvieu2k8evmxda.jpg',
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855793/renamarket-website-files/Homepage/Carousel/cnks64byzw4uzedp20j9.jpg',
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855793/renamarket-website-files/Homepage/Carousel/vjnllg4osi05ugoo7g83.jpg',
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855793/renamarket-website-files/Homepage/Carousel/ktgjemfgtjf3itbtbh41.jpg',
  ];

  banners: string[] = [
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855777/renamarket-website-files/Homepage/vce5hudxcdrakjkefuuf.jpg',
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855777/renamarket-website-files/Homepage/t7fsczsdvduybzb7wvv8.jpg',
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855777/renamarket-website-files/Homepage/qr7equdph7cf6ltallrx.jpg',
    'https://res.cloudinary.com/dbmgmudf0/image/upload/v1705855776/renamarket-website-files/Homepage/wbw332e998mom5gufabo.jpg',
  ];

  loadingCategories: boolean = false;

  constructor(
    private promotedProductsService: PromotedProductsService,
    private recommendedProductsService: RecommendedProductService,
    private categoryService: CatgoryService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.fetchRecommendedProducts();
    this.fetchPromotedProducts();
    this.fetchCategories();
  }

  fetchRecommendedProducts = () => {
    this.recommendedProductsService.getAllRecommendedProducts().subscribe({
      next: (data) => {
        this.recommendedProducts = data;
      },
      error: (err) => {
        this.loadingRecommendedProducts = false;
      },
      complete: () => {
        this.loadingRecommendedProducts = false;
      },
    });
  };

  fetchPromotedProducts = () => {
    this.promotedProductsService.getAllPromotedProducts().subscribe({
      next: (data) => {
        this.promotedProducts = data;
      },
      error: (err) => {
        this.loadingPromotedProducts = false;
      },
      complete: () => {
        this.loadingPromotedProducts = false;
      },
    });
  };

  fetchCategories = () => {
    this.loadingCategories = true;
    this.categoryService
      .getAllStorefrontCategories()
      .then((res) => {
        const categories = (res.hits as any[])
          .sort((a, b) => a.orderingNumber - b.orderingNumber)
          .filter((cat, index) => {
            // this just a temporary fix. this category doesn't have ordering number and it's removed awaiting when it will totally be removed from the database, I have also requested for it to be removed by mujib on April 22 2024
            TODO: return (
              index !== 9 && cat.id !== 'e3393601-6453-4194-b5da-27ac8db5e92d'
            );
          });
        this.categories = categories;
        this.loadingCategories = false;
      })
      .catch((err) => {
        this.loadingCategories = false;
      });
  };

  onSeePromotedProducts() {
    this.productService.promotedProductsInView.next(true);
  }
}
