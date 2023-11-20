import { Component } from '@angular/core';
import { ProductModel } from 'src/app/models/products.model';
import { SearchService } from 'src/app/services/search/search.service';

@Component({
  selector: 'app-rena-home',
  templateUrl: './rena-home.component.html',
  styleUrls: ['./rena-home.component.scss'],
})
export class RenaHomeComponent {
  pageNumber = 0;
  maximumItem = 12;
  search = '';
  categoryName = '';
  cityName = '';
  stateName = '';
  storefrontSellerId = '';
  minValue = 0;
  maxValue = 500000;

  products: ProductModel[] = [];

  loadingProducts = true;
  loadingMoreProducts = true;

  heroSlides = [
    'assets/img/hero-home.png',
    'assets/img/hero-home.png',
    'assets/img/hero-home.png',
  ];

  categories = [
    { name: 'Supermarket', img: 'assets/svg/supermarket.svg' },
    { name: 'Health & Beauty', img: 'assets/svg/health.svg' },
    { name: 'Home & Office', img: 'assets/svg/home-office.svg' },
    { name: 'Phones & Tablets', img: 'assets/svg/phone.svg' },
    { name: 'Computing', img: 'assets/svg/computing.svg' },
    { name: 'Electronics', img: 'assets/svg/electronics.svg' },
    { name: 'Fashion', img: 'assets/svg/fashion.svg' },
    { name: 'Baby Products', img: 'assets/svg/baby.svg' },
    { name: 'Sporting', img: 'assets/svg/sporting.svg' },
    { name: 'Gaming', img: 'assets/svg/games.svg' },
    { name: 'Automobile', img: 'assets/svg/automobile.svg' },
  ];

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchService
      .getAllProducts(
        this.pageNumber,
        this.maximumItem,
        this.search,
        this.categoryName,
        this.cityName,
        this.stateName,
        this.storefrontSellerId,
        this.minValue,
        this.maxValue
      )
      .subscribe({
        next: (data) => {
          if (this.pageNumber === 0) {
            this.products = data;
          } else {
            this.products = [...this.products, ...data];
          }
        },
        error: (err) => {
          this.loadingProducts = false;
          this.loadingMoreProducts = false;
          console.log(err);
        },
        complete: () => {
          this.loadingProducts = false;
          this.loadingMoreProducts = false;
        },
      });
  }
}
