import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductModel } from 'src/app/models/products.model';
import { CatgoryService } from 'src/app/services/category/catgory.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // @ViewChild('categoryItem') categoryItem: ElementRef<HTMLElement>;
  categories: any;
  products: ProductModel[] = [];
  totalItemCount: number;
  maximumItem: number = 10;
  defaultPage:number = 1;
  pageNumber: number;
  search:string = "";
  categoryId:string = "";
  minValue: number = 1;
  maxValue: number = 500000;
  // options:Options;
  // form: FormGroup;
  loadingProducts: boolean;
  loadingCategories: boolean;
  columnCount = 3;

  // value: number = 700;
  // highValue: number = 7590;
  options: Options = {
    floor: 0,
    ceil: 1000000
  };

  distanceValue: number = 35;
  distanceHighValue: number = 110;
  distanceOptions: Options = {
    floor: 0,
    ceil: 200
  };

  constructor(
    private productService: ProductsService,
    private categoryService: CatgoryService,
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.fetchAllProducts(this.defaultPage);
    this.fetchCategories();
  }

  fetchProductsByCategory = (id) => {
    this.categoryId = id;
    this.fetchAllProducts(this.defaultPage);
  }

  resetProducts = () => {
    this.categoryId = '';
    this.fetchAllProducts(this.defaultPage);
  }

  fetchAllProducts = (pageNumber:any) => {
    this.loadingProducts = true;
    this.productService.getProducts(
      pageNumber, this.maximumItem, this.search, this.categoryId,
      this.minValue, this.maxValue
    ).subscribe((products) => {
        this.products = products.data.data;
        this.pageNumber = products.data.pager.pageNumber;
        this.totalItemCount = products.data.pager.totalItemCount;
        this.loadingProducts = false;
      }, error => {
        this.loadingProducts = false;
        // console.error(error)
      });
  }

  fetchCategories = () => {
    this.loadingCategories = true;
    this.categoryService.GetCategory().subscribe((res) => {
      this.categories = res.data;
      this.loadingCategories = false;
    }, err => {
      this.loadingCategories = false;
    });
  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }

}
