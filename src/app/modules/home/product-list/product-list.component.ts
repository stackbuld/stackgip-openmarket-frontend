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
  isFilter: string = ''; // price or ''
  categoryName: string = '';
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
    this.fetchAllProducts(this.pageNumber);
    this.fetchCategories();
  }

  resetProducts = () => {
    this.categoryId = '';
    this.fetchAllProducts(this.pageNumber, this.isFilter);
  };

  fetchAllProducts = (pageNumber: number, isFilter?: string) => {
    if (this.categoryId === '') {
      this.isFilter = '';
    } else {
      this.isFilter = 'category';
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
        this.categoryName,
        this.minValue,
        this.maxValue,
        isFilter
      )
      .subscribe({
        next: (data) => {
          console.log('DATA', data);
          if (this.pageNumber === 0 || this.isFilter) {
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
      this.isFilter = '';
      this.loadingMoreProducts = true;
      this.pageNumber++;
      this.fetchAllProducts(this.pageNumber, this.isFilter);
    } else {
      this.loadingMoreProducts = false;
    }
  }

  filterProductsByPrice() {
    this.isFilter = 'price';
    this.fetchAllProducts(this.pageNumber, this.isFilter);
  }

  filterProductsByCategory(item: any) {
    this.categoryId = item.id;
    this.categoryName = item.name;
    this.isFilter = 'category';
    this.fetchAllProducts(this.pageNumber, this.isFilter);
  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }
}
