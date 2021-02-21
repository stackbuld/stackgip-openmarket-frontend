import { ProductsService } from "src/app/services/products/products.service";
import { Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {ProductWithOptionAndShipmentModel, CreateProductOption} from "./../../models/products.model";
import { formatDate } from "./../../helpers/date-format";
import { numberWithCommas } from './../../helpers/number-format';
import { debounceTime } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-add-to-cart",
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.css"],
})
export class AddToCartComponent implements OnInit {
  @Input() productId: number
  @Output() addedToCart = new EventEmitter()
  @Output() closed = new EventEmitter()
  productOptions:{[title:string]:CreateProductOption[]}
  product: ProductWithOptionAndShipmentModel
  currentOptions:{[title:string]:number} = {}
  numberWithCommas:Function
  priceWithOptions:number
  currentQuantity:number
  optionForm: FormGroup
  formatDate:Function
  totalPrice:number

  constructor(
    private productService: ProductsService,private toast: ToastrService,
    private fb: FormBuilder) {
    this.numberWithCommas = numberWithCommas
    this.formatDate = formatDate;
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId.toString()).subscribe((a) => {
        this.product = (a.data as unknown) as ProductWithOptionAndShipmentModel  
        this.init() 
    });
    this.optionForm = this.fb.group({
      shipmentOption:['',[Validators.required]],
      quantity:[1,[Validators.required]],
      options: this.fb.array([])
    });
    this.optionForm.get('quantity').valueChanges.pipe(debounceTime(200))
    .subscribe(data => this.onQuantityValueChanged(data))
    this.currentQuantity = 1
  }

  init(): void {
    this.productOptions = this.groupBy(this.product.productOptions,'title')
    this.setOptionForm(Object.keys(this.productOptions))
    this.priceWithOptions = this.product.price
    this.totalPrice = this.product.price
  }

  optionArray():FormArray{
    return this.optionForm.get('options') as FormArray;
  }

  setOptionForm(options:string[]):void{
    options.forEach((option) => {
      const itemToAdd = this.fb.group({title:option,cost:[0,[]]})
      itemToAdd.valueChanges.pipe(debounceTime(200)).subscribe(
        data => this.onOptionValueChanged(data)
      )
      this.optionArray().push(itemToAdd)
      this.currentOptions[option] = 0
    });
  }

  onQuantityValueChanged(qty:number){
    this.currentQuantity = qty
    this.totalPrice = this.priceWithOptions * this.currentQuantity
  }

  onOptionValueChanged(data:{title:string,cost:number}){
    this.priceWithOptions -= this.currentOptions[data.title]
    this.priceWithOptions += Number(data.cost)
    this.currentOptions[data.title] = data.cost
    this.totalPrice = Number(this.priceWithOptions) * Number(this.currentQuantity)
  }

  addToCart(){
    const shipmentOption = this.optionForm.get('shipmentOption')
    if(shipmentOption.hasError('required')){
      this.toast.error("please select shipment option")
      return
    }
    this.product.price = this.priceWithOptions
    this.addedToCart.emit(
      {
        product:this.product,
        orderedUnit:this.currentQuantity,
        shipmentOption:shipmentOption.value
      }
    )
  }

  groupBy(productOptions:CreateProductOption[], property:string)
    :{[title:string]:CreateProductOption[]}{
    return productOptions.reduce((acc, obj) => {
       const key = obj[property]
       if (!acc[key]) {acc[key] = []}
       acc[key].push(obj)
       return acc
    }, {})
  }

  close(){
    this.closed.emit()
  }
}
