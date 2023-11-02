import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductModel } from 'src/app/models/products.model';
import { CatgoryService } from 'src/app/services/category/catgory.service';
import { FooterService } from 'src/app/services/footer.service';
// import {ISearchService} from '../../../services/search/iSearchService.interface';
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
  totalItemCount: number;
  maximumItem: number = 12;
  defaultPage: number = 1;
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
  isFilter: boolean;
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
    // document.body.scrollTop = 0;
    // document.documentElement.scrollTop = 0;
    this.footerService.setShowFooter(false);
    this.fetchAllProducts(this.defaultPage);
    this.fetchCategories();
  }

  fetchProductsByCategory = (id) => {
    this.categoryId = id;
    this.fetchAllProducts(this.defaultPage);
  };

  resetProducts = () => {
    this.categoryId = '';
    this.fetchAllProducts(this.defaultPage);
  };

  fetchAllProducts = (pageNumber: number) => {
    if (this.categoryId === '') {
      this.isFilter = false;
    } else {
      this.isFilter = true;
    }
    if (pageNumber === 1) {
      this.loadingProducts = true;
    }

    this.searchService
      .getAllProducts(
        this.defaultPage,
        this.maximumItem,
        this.search,
        this.categoryId,
        this.minValue,
        this.maxValue
      )
      .subscribe({
        next: (res) => {
          this.loadingProducts = true;
          this.products = [...this.products, ...res.data];
          this.pageNumber = res.pager.pageNumber;
          this.totalItemCount = res.pager.totalItemCount;
        },
        error: (err) => console.log(err),
        complete: () => (this.loadingProducts = false),
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

  // @HostListener('window:scroll', ['$event'])
  // onScroll() {
  //   const scrollPosition =
  //     window.scrollY ||
  //     document.documentElement.scrollTop ||
  //     document.body.scrollTop ||
  //     0;
  //   const windowHeight =
  //     window.innerHeight ||
  //     document.documentElement.clientHeight ||
  //     document.body.clientHeight ||
  //     0;
  //   const documentHeight =
  //     document.documentElement.scrollHeight || document.body.scrollHeight || 0;

  //   if (documentHeight - scrollPosition < windowHeight + 100) {
  //     if (this.canLoadMore) {
  //       this.pageNumber++;
  //       this.loadingMoreProducts = true;
  //       this.fetchAllProducts(this.pageNumber);
  //     } else {
  //       this.loadingMoreProducts = false;
  //     }
  //   }
  // }

  showMoreProducts() {
    if (this.canLoadMore) {
      this.pageNumber++;
      this.loadingMoreProducts = true;
      this.fetchAllProducts(this.pageNumber);
      this.loadingMoreProducts = false;
    } else {
      this.loadingMoreProducts = false;
    }
  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }
}
