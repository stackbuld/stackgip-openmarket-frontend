import { Component, Input, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductModel } from 'src/app/models/products.model';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { FooterService } from 'src/app/services/footer.service';
import { SearchService } from 'src/app/services/search/search.service';
import { CityService } from 'src/app/services/city/city.service';
import { StateService } from 'src/app/services/state/state.service';
import { ICategory } from 'src/app/models/CategoryModels';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  // @ViewChild('categoryItem') categoryItem: ElementRef<HTMLElement>;
  @Input() storefrontSellerId: string = '';
  categories: ICategory[] = [];
  products: ProductModel[] = [];
  cities: string[] = [];
  states: string[] = [];

  categoryListLimit: number = 6;
  categoryMoreLimit: number = 6;

  cityListLimit: number = 6;
  cityMoreLimit: number = 6;

  stateListLimit: number = 6;
  stateMoreLimit: number = 6;

  // totalItemCount: number;
  maximumItem: number = 12;
  pageNumber: number = 0;
  search: string = '';
  // categoryId: string = '';
  minValue: number = 1;
  maxValue: number = 500000;
  // options:Options;
  // form: FormGroup;
  loadingProducts: boolean = false;
  loadingMoreProducts: boolean = false;
  loadingCategories: boolean = false;
  loadingCities: boolean = false;
  loadingStates: boolean = false;
  columnCount: number = 6;
  canLoadMore = true;

  // value: number = 700;
  // highValue: number = 7590;
  options: Options = {
    floor: 0,
    ceil: 1000000,
  };

  isCategoryFilter: boolean = false;
  isCityFilter: boolean = false;
  isStateFilter: boolean = false;

  categoryId: string = '';
  categoryName: string = '';
  cityName: string = '';
  stateName: string = '';

  isCategorySearchFocused: boolean = false;
  isCitySearchFocused: boolean = false;
  isStateSearchFocused: boolean = false;

  distanceValue: number = 1;
  distanceHighValue: number = 115;
  distanceOptions: Options = {
    floor: 0,
    ceil: 200,
  };

  constructor(
    private productService: ProductsService,
    private categoryService: CatgoryService,
    private footerService: FooterService,
    private searchService: SearchService,
    private cityService: CityService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.footerService.setShowFooter(false);
    this.fetchAllProducts(this.pageNumber);
    this.fetchCategories();
    this.fetchCities();
    this.fetchStates();
  }

  onCategorySearch(category: string) {
    this.categoryName = category;
    this.loadingCategories = true;
    this.categoryService.getAllCategories(category).subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCategorySearchFocus() {
    this.isCategorySearchFocused = true;
  }

  onCategorySearchBlur() {
    this.isCategorySearchFocused = false;
    this.fetchCategories();
  }

  onCitySearch(city: string) {
    this.cityName = city;
    this.loadingCities = true;
    this.cityService.searchCities(city, this.storefrontSellerId).subscribe({
      next: (data) => {
        this.cities = data;
        this.loadingCities = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCitySearchFocus() {
    this.isCitySearchFocused = true;
  }

  onCitySearchBlur() {
    this.isCitySearchFocused = false;
    this.fetchCities();
  }

  onStateSearch(state: string) {
    this.stateName = state;
    this.loadingStates = true;
    this.stateService.searchStates(state, this.storefrontSellerId).subscribe({
      next: (data) => {
        this.states = data;
        this.loadingStates = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onStateSearchFocus() {
    this.isStateSearchFocused = true;
  }

  onStateSearchBlur() {
    this.isStateSearchFocused = false;
    this.fetchStates();
  }

  showMoreCategories() {
    this.categoryListLimit += this.categoryMoreLimit;
    this.categoryMoreLimit = this.categoryMoreLimit * 2;
  }

  showMoreCities() {
    this.cityListLimit += this.cityMoreLimit;
    this.cityMoreLimit = this.cityMoreLimit * 2;
  }

  showMoreStates() {
    this.stateListLimit += this.stateMoreLimit;
    this.stateMoreLimit = this.stateMoreLimit * 2;
  }

  resetProducts = () => {
    this.search = '';
    this.categoryName = '';
    this.cityName = '';
    this.stateName = '';
    this.minValue = 1;
    this.maxValue = 500000;
    this.fetchAllProducts(0);
  };

  resetProductsByCategory = () => {
    this.categoryName = '';
    this.fetchAllProducts(0);
  };

  resetProductsByState = () => {
    this.stateName = '';
    this.fetchAllProducts(0);
  };

  resetProductsByCity = () => {
    this.cityName = '';
    this.fetchAllProducts(0);
  };

  fetchAllProducts = (pageNumber: number) => {
    this.isCategoryFilter = !!this.categoryName;
    this.isCityFilter = !!this.cityName;
    this.isStateFilter = !!this.stateName;

    this.pageNumber = pageNumber;

    if (!this.pageNumber) {
      this.loadingProducts = true;
    }

    if (this.pageNumber > 0) {
      this.loadingMoreProducts = true;
    }

    if (this.storefrontSellerId) {
      this.columnCount = 4;
    }

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
  };

  fetchCategories = () => {
    this.loadingCategories = true;
    if (this.categoryId) {
      this.categoryService
        .getAllSellerStorefrontCategories(this.categoryId)
        .subscribe({
          next: (data) => {
            this.categories = data;
            this.loadingCategories = false;
          },
          error: (err) => {
            this.loadingCategories = false;
          },
        });
    } else {
      this.categoryService.getAllCategories().subscribe({
        next: (data) => {
          this.categories = data;
          this.loadingCategories = false;
        },
        error: (err) => {
          this.loadingCategories = false;
        },
      });
    }
  };

  fetchCities = () => {
    this.loadingCities = true;
    this.cityService.getAllCities(this.storefrontSellerId).subscribe({
      next: (data) => {
        this.cities = data;
        this.loadingCities = false;
      },
      error: (err) => {
        this.loadingCities = false;
      },
    });
  };

  fetchStates = () => {
    this.loadingStates = true;
    this.stateService.getAllStates(this.storefrontSellerId).subscribe({
      next: (data) => {
        this.states = data;
        this.loadingStates = false;
      },
      error: (err) => {
        this.loadingStates = false;
      },
    });
  };

  showMoreProducts() {
    if (this.canLoadMore) {
      this.loadingMoreProducts = true;
      this.pageNumber++;
      this.fetchAllProducts(this.pageNumber);
    } else {
      this.loadingMoreProducts = false;
    }
  }

  filterProductsByPrice() {
    this.fetchAllProducts(0);
  }

  filterProductsByCategory(category: ICategory) {
    this.categoryName = category.name;
    this.categoryId = category.id.toString();
    this.fetchAllProducts(0);
    this.fetchCategories();
  }

  filterProductsByCity(item: string) {
    this.cityName = item;
    this.fetchAllProducts(0);
    this.fetchCities();
  }

  filterProductsByState(item: string) {
    this.stateName = item;
    this.fetchAllProducts(0);
    this.fetchStates();
  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }
}
