import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductModel } from  "../../../../models/products.model";
import { ProductsService } from "../../../../services/products/products.service";
import { ToastrService } from "./../../../../services/toastr.service";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { numberWithCommas } from './../../../../helpers/number-format';
import { formatDateToLocal } from "./../../../../helpers/date-format";
import uikit from "uikit";
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Output() productIdSend = new EventEmitter()
  @Output() viewedMore = new EventEmitter()
  numberWithCommas:Function = numberWithCommas
  user = getLoggedInUser()
  productDetails: ProductModel[]
  formatDateToLocal:Function
  productSort:string = 'Date' //Date or UnitSold
  byAscending: boolean = false
  pageNumber: number
  totalItemCount: number
  maximumItem: number = 4
  defaultPage:number = 1
  keyword:string = ''
  category:string = ''
  type:string = 'All' //All or Custom
  startDate:string = ''
  endDate:string = ''
  minValue:number = 10
  maxValue:number = 500000

  constructor(
     private productService: ProductsService,
     private toast: ToastrService
  ){this.formatDateToLocal = formatDateToLocal}

  ngOnInit():void{
    this.fetchNextProducts(this.defaultPage)
  } 
  
  onDelete(productId:number):void{
    uikit.modal.confirm(
      'Are you sure that you want to remove this ?'
    ).then(()=>{
        this.productService.deleteProduct(productId).subscribe((a)=>{
          this.productDetails = this.productDetails.filter(
            (b) => b.id !== productId
          );
        });
        this.toast.success("product removed successfully")
      },()=>{})
  }

  public addProduct(product: ProductModel):void{
    this.productDetails.push(product)
  }

  public updateProduct(product: ProductModel):void{
    const index = this.productDetails.findIndex(
      (p) => p.id === product.id
    );
    this.productDetails[index] = product
  }

  setProductId(productId:string):void{
    this.productIdSend.emit({productId})
  }

  setViewMore(productId:string):void{
    this.viewedMore.emit({productId})
  }

  fetchNextProducts(pageNumber:number){
    this.productService.getSellerProducts(
      this.user.id, pageNumber, this.maximumItem, this.keyword, 
      this.category, this.minValue, this.maxValue, this.type, this.startDate, 
      this.endDate, this.productSort, this.byAscending
    ).subscribe((productDetail) => {
        this.productDetails = productDetail.data.data;
        this.pageNumber = productDetail.data.pager.pageNumber;
        this.totalItemCount = productDetail.data.pager.totalItemCount;
      },error => console.error(error))
  }

  onSearch(data):void{
    this.keyword = data.keyword
    this.category = data.category
    this.startDate = data.startDate?data.startDate.toLocaleDateString():''
    this.endDate = data.endDate?data.startDate.toLocaleDateString():''
    this.minValue = data.minValue
    this.maxValue = data.maxValue
    if(this.startDate !== ''){
      this.type = 'Custom'
    }
    this.fetchNextProducts(this.defaultPage)
  }

  onSearchClear(data):void{
    this.keyword = ''
    this.category = ''
    this.startDate = ''
    this.endDate = ''
    this.minValue = 10
    this.maxValue = 500000
  }

  sortBy(field:string, asc:boolean = true):void{
    this.productSort = field
    this.byAscending = asc
    this.fetchNextProducts(this.defaultPage)
  }

  // sortByUnitLeft(reverse:boolean = false):void{
  //   this.productDetails.sort((a:ProductModel,b:ProductModel)=>{
  //     if(reverse){
  //       return b.unit - a.unit
  //     }
  //     return a.unit - b.unit
  //   })
  // }
}
