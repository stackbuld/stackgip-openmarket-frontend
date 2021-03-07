import { ProductsService } from "src/app/services/products/products.service";
import { ProductModel } from "src/app/models/products.model";
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CatgoryService } from './../../../services/category/catgory.service';
import { CategoryResponse } from './../../../models/CategoryModels';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.css"],
})
export class ListProductComponent implements OnInit {
  categories$: Observable<CategoryResponse>
  products: ProductModel[] = [];
  totalItemCount: number;
  maximumItem: number = 20;
  defaultPage:number = 1;
  pageNumber: number;
  search:string = "";
  categoryId:string = "";
  minValue: number = 1800;
  maxValue: number = 5000;
  options:Options;
  form: FormGroup;

  constructor(
    private productService: ProductsService,
    private categoryService: CatgoryService,
    private route: ActivatedRoute,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.GetCategory();
    let search = this.route.snapshot.queryParamMap.get("search");
    this.search = search ? search : "";
    let categoryId = this.route.snapshot.queryParamMap.get("categoryId");
    this.categoryId = categoryId ? categoryId : "";
    this.fetchNextProducts(this.defaultPage)
    this.setPriceRangeOption()
    this.form = this.fb.group({
      keyword: ["", []],
      category: ["", []],
    })
  }

  setPriceRangeOption(){
    this.options = {
      floor: 500,
      ceil: 10000,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return '<b>Min price:</b> N ' + value;
          case LabelType.High:
            return '<b>Max price:</b> N ' + value;
          default:
            return 'N ' + value;
        }
      }
    } as Options
  }

  fetchNextProducts(pageNumber:number){
    this.productService.getProducts(pageNumber, this.maximumItem, this.search, this.categoryId)
      .subscribe((products) => {
        this.products = products.data.data;
        this.pageNumber = products.data.pager.pageNumber;
        this.totalItemCount = products.data.pager.totalItemCount;
      },error => console.error(error));
  }

  onSearch(){
    this.search = this.form.get("keyword").value
    this.categoryId = this.form.get("category").value
    this.fetchNextProducts(this.defaultPage)
  }
}
