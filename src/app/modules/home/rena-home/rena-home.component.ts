import { Component } from '@angular/core';
import {
  PromotedProduct,
  RecommendedProduct,
} from 'src/app/models/products.model';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { ICategory } from 'src/app/models/CategoryModels';
import { PromotedProductsService } from 'src/app/services/promoted-products/promoted-products.service';
import { RecommendedProductService } from 'src/app/services/recomended-product/recommended-product.service';
@Component({
  selector: 'app-rena-home',
  templateUrl: './rena-home.component.html',
  styleUrls: ['./rena-home.component.scss'],
})
export class RenaHomeComponent {
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
    'assets/img/hero-home.png',
    'assets/img/hero-home.png',
    'assets/img/hero-home.png',
  ];

  loadingCategories: boolean = false;

  constructor(
    private promotedProductsService: PromotedProductsService,
    private recommendedProductsService: RecommendedProductService,
    private categoryService: CatgoryService
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
        console.log('RECOMMENDED PRODUCTS FETCHED');
      },
      error: (err) => {
        this.loadingRecommendedProducts = false;
        console.log('RECOMMENDED PRODUCTS ERROR', err);
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
        console.log('PROMOTED PRODUCTS FETCHED');
      },
      error: (err) => {
        this.loadingPromotedProducts = false;
        console.log('PROMOTED PRODUCTS ERROR', err);
      },
      complete: () => {
        this.loadingPromotedProducts = false;
      },
    });
  };

  fetchCategories = () => {
    this.loadingCategories = true;
    this.categoryService.getAllStorefrontCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('CATEGORIES HOMEPAGE', this.categories);
        this.loadingCategories = false;
      },
      error: (err) => {
        this.loadingCategories = false;
      },
    });
  };
}
