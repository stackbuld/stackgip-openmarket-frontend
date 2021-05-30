import { ProductsService } from "src/app/services/products/products.service";
import { ProductModel } from "src/app/models/products.model";
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CatgoryService } from './../../../services/category/catgory.service';
import { CategoryResponse } from './../../../models/CategoryModels';
import { ToastrService } from "./../../../services/toastr.service"
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.css"],
})
export class ListProductComponent implements OnInit {
  @ViewChild('categoryItem') categoryItem: ElementRef<HTMLElement>;
  categories$: Observable<CategoryResponse>
  products: ProductModel[] = [];
  totalItemCount: number;
  maximumItem: number = 20;
  defaultPage:number = 1;
  pageNumber: number;
  search:string = "";
  categoryId:string = "";
  minValue: number = 10;
  maxValue: number = 500000;
  options:Options;
  form: FormGroup;

  constructor(
    private productService: ProductsService,
    private categoryService: CatgoryService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private fb: FormBuilder 
  ) {}

  ngOnInit(): void {
    this.categories$ = this.categoryService.GetCategory();
    let search = this.route.snapshot.queryParamMap.get("search");
    this.search = search ? search : "";
    let categoryId = this.route.snapshot.queryParamMap.get("categoryId");
    this.categoryId = categoryId ? categoryId : "";
    this.fetchNextProducts(this.defaultPage)
    this.form = this.fb.group({
      keyword: ["", []],
      category: ["", []],
      minPrice: [10, []],
      maxPrice: [500000, []],
    })
  }


  fetchNextProducts(pageNumber:number){
      this.productService.getProducts(
        pageNumber, this.maximumItem, this.search, this.categoryId, 
        this.minValue, this.maxValue
      ).subscribe((products) => {
          this.products = products.data.data;
          this.pageNumber = products.data.pager.pageNumber;
          this.totalItemCount = products.data.pager.totalItemCount;
        },error => console.error(error)
      );
  }

  onSearch(){
    this.search = this.form.get('keyword').value
    this.categoryId = this.form.get('category').value
    this.minValue = this.form.get('minPrice').value
    this.maxValue = this.form.get('maxPrice').value
    this.fetchNextProducts(this.defaultPage)
  }

  onClear(){
    this.form.get('keyword').setValue('')
    this.form.get('category').setValue('')
    this.form.get('minPrice').setValue(10)
    this.form.get('maxPrice').setValue(500000)
    this.categoryItem.nativeElement.innerText = ''
  }

  onChangeMinPrice(){
    this.resetPrice()
  }

  onChangeMaxPrice(){
    if(this.resetPrice()){
      this.toast.error("Maximum price must be greater than minimum price")
    }
  }

  resetPrice():boolean{
    const minPrice:number = this.form.get('minPrice').value
    const maxPrice:number = this.form.get('maxPrice').value
    if(minPrice > maxPrice){
      this.form.get('maxPrice').setValue(minPrice)
      return true
    }
    return false
  }
}
