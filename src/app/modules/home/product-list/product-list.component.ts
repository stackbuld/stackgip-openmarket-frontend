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
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  // @ViewChild('categoryItem') categoryItem: ElementRef<HTMLElement>;
  @Input() storefrontSellerId: string = '';

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  tableSizes: any = [3, 6, 9, 12];

  categories: string[] = [];
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
  queryParamFlag: boolean = false;

  // value: number = 700;
  // highValue: number = 7590;
  options: Options = {
    floor: 0,
    ceil: 1000000,
  };

  isCategoryFilter: boolean = false;
  isCityFilter: boolean = false;
  isStateFilter: boolean = false;

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
    private stateService: StateService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.footerService.setShowFooter(false);
    this.fetchQueryParamsFromUrl();
    this.fetchAllProducts(this.pageNumber);
    this.fetchCategories();
    this.fetchCities();
    this.fetchStates();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.pageNumber = event - 1;
    this.fetchAllProducts(this.pageNumber);
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchAllProducts(this.pageNumber);
  }

  removeQueryParam(filter: string) {
    // Get the current query parameters
    const queryParams = { ...this.route.snapshot.queryParams };

    if (filter === 'category') {
      this.categoryName = '';
      queryParams.category = null;
    }

    if (filter === 'city') {
      this.cityName = '';
      queryParams.city = null;
    }

    if (filter === 'state') {
      this.stateName = '';
      queryParams.state = null;
    }

    // Navigate to the same route with modified query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  fetchQueryParamsFromUrl() {
    const { category, city, state, minPrice, maxPrice } =
      this.searchService.getQueryParams();

    const currentParamsObj = {};

    if (category && (!this.categoryName || this.categoryName !== category)) {
      this.categoryName = category;
      currentParamsObj['category'] = this.categoryName;
    }

    if (city && (!this.cityName || this.cityName !== city)) {
      this.cityName = city;
      currentParamsObj['city'] = this.cityName;
    }

    if (state && (!this.stateName || this.stateName !== state)) {
      this.stateName = state;
      currentParamsObj['state'] = this.stateName;
    }

    if (minPrice && (!this.minValue || this.minValue !== Number(minPrice))) {
      this.minValue = Number(minPrice);
      currentParamsObj['minPrice'] = this.minValue;
    }

    if (maxPrice && (!this.maxValue || this.maxValue !== Number(maxPrice))) {
      this.maxValue = Number(maxPrice);
      currentParamsObj['maxPrice'] = this.maxValue;
    }
    return currentParamsObj;
  }

  onCategorySearch(category: string) {
    this.loadingCategories = true;
    this.categoryService
      .searchCategories(category, this.storefrontSellerId)
      .subscribe({
        next: (data) => {
          this.categories = data;
          this.loadingCategories = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  onCategorySearchClose() {
    this.isCategorySearchFocused = false;
    this.fetchCategories();
  }

  onCitySearch(city: string) {
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

  onCitySearchClose() {
    this.isCitySearchFocused = false;
    this.fetchCities();
  }

  onStateSearch(state: string) {
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

  onStateSearchClose() {
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
    const queryParams = { ...this.route.snapshot.queryParams };
    queryParams.category = null;
    queryParams.city = null;
    queryParams.state = null;
    queryParams.minPrice = null;
    queryParams.maxPrice = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  };

  resetProductsByCategory = () => {
    this.removeQueryParam('category');
    this.fetchAllProducts(0);
  };

  resetProductsByState = () => {
    this.removeQueryParam('state');
    this.fetchAllProducts(0);
  };

  resetProductsByCity = () => {
    this.removeQueryParam('city');
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
        this.storefrontSellerId,
        this.categoryName,
        this.cityName,
        this.stateName,
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

    this.categoryService.getAllCategories(this.storefrontSellerId).subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
      },
      error: (err) => {
        this.loadingCategories = false;
      },
    });
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

  filterProductsByCategory(category: string) {
    this.categoryName = category;
    this.fetchAllProducts(0);
    if (!this.isCategorySearchFocused) {
      this.fetchCategories();
    }
    this.router.navigate([], {
      queryParams: { category },
      queryParamsHandling: 'merge',
    });
  }

  filterProductsByCity(city: string) {
    this.cityName = city;
    this.fetchAllProducts(0);
    if (!this.isCitySearchFocused) {
      this.fetchCities();
    }
    this.router.navigate([], {
      queryParams: { city },
      queryParamsHandling: 'merge',
    });
  }

  filterProductsByState(state: string) {
    this.stateName = state;
    this.fetchAllProducts(0);
    if (!this.isStateSearchFocused) {
      this.fetchStates();
    }
    this.router.navigate([], {
      queryParams: { state },
      queryParamsHandling: 'merge',
    });
  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }
}
