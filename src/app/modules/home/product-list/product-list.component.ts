import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductModel } from 'src/app/models/products.model';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { FooterService } from 'src/app/services/footer.service';
import { SearchService } from 'src/app/services/search/search.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  // @ViewChild('categoryItem') categoryItem: ElementRef<HTMLElement>;
  categories: any;
  products: ProductModel[] = [];
  // totalItemCount: number;
  maximumItem: number = 12;
  pageNumber: number = 0;
  search: string = '';
  categoryId: string = '';
  minValue: number = 1;
  maxValue: number = 500000;
  // options:Options;
  // form: FormGroup;
  loadingProducts: boolean = false;
  loadingMoreProducts: boolean = false;
  loadingCategories: boolean;
  columnCount = 6;
  canLoadMore = true;

  // value: number = 700;
  // highValue: number = 7590;
  options: Options = {
    floor: 0,
    ceil: 1000000,
  };
  isFilter: boolean = false;
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
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.footerService.setShowFooter(false);
    this.fetchAllProducts(this.pageNumber, this.isFilter);
    this.fetchCategories();
  }

  fetchProductsByCategory = (id) => {
    this.categoryId = id;
    this.isFilter = true;
    this.fetchAllProducts(this.pageNumber, this.isFilter);
  };

  resetProducts = () => {
    this.categoryId = '';
    this.isFilter = false;
    this.fetchAllProducts(this.pageNumber, this.isFilter);
  };

  fetchAllProducts = (pageNumber: number, isFilter?: boolean) => {
    if (this.categoryId === '') {
      this.isFilter = false;
    } else {
      this.isFilter = true;
    }

    if (!this.pageNumber) {
      this.loadingProducts = true;
    }

    if (this.pageNumber > 0) {
      this.loadingMoreProducts = true;
    }

    this.searchService
      .getAllProducts(
        this.pageNumber,
        this.maximumItem,
        this.search,
        this.categoryId,
        this.minValue,
        this.maxValue,
        isFilter
      )
      .subscribe({
        next: (data) => {
          console.log('DATA', data);
          if (this.pageNumber === 0 || this.isFilter === true) {
            this.products = data;
          } else {
            this.products = [...this.products, ...data];
          }
          console.log('PRODUCTS', this.products);
          // this.totalItemCount = res.pager.totalItemCount;
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
    this.categoryService.GetCategory().subscribe(
      (res) => {
        this.categories = res.data;
        this.loadingCategories = false;
      },
      (err) => {
        this.loadingCategories = false;
      }
    );
  };

  showMoreProducts() {
    if (this.canLoadMore) {
      this.isFilter = false;
      this.loadingMoreProducts = true;
      this.pageNumber++;
      this.fetchAllProducts(this.pageNumber, this.isFilter);
    } else {
      this.loadingMoreProducts = false;
    }
  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }
}
