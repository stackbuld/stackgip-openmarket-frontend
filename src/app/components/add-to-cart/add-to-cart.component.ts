import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { EditProductModel } from './../../models/products.model';
import { formatDate } from './../../helpers/date-format';
import { numberWithCommas } from './../../helpers/number-format';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  @Output() addedToCart = new EventEmitter();
  @Input() product:EditProductModel
  optionForm: FormGroup
  currentOptions = {}//:Map<string,number>
  productOptions:any
  formatDate:Function
  numberWithCommas:Function
  priceWithOptions:number
  currentQuantity:number
  totalPrice:number

  constructor(private fb: FormBuilder) { 
    this.formatDate = formatDate
    this.numberWithCommas = numberWithCommas
  }

  ngOnInit(): void {
    this.productOptions = this.groupBy(this.product.productOptions,'title')
    this.optionForm = this.fb.group({
      quantity:[1,[Validators.required]],
      options: this.fb.array([])
    });
    this.setOptionForm(Object.keys(this.productOptions))
    this.optionForm.get('quantity').valueChanges.pipe(debounceTime(200))
    .subscribe(data => this.onQuantityValueChanged(data))
    this.priceWithOptions = this.product.price
    this.totalPrice = this.product.price
    this.currentQuantity = 1
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
    this.product.price = this.totalPrice
    this.addedToCart.emit(
      {product:this.product,orderedUnit:this.currentQuantity}
    )
  }

  groupBy(objectArray, property:string) {
    return objectArray.reduce((acc, obj) => {
       const key = obj[property];
       if (!acc[key]) {
          acc[key] = [];
       }
       acc[key].push(obj);
       return acc;
    }, {})
  }

}
