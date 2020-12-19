import { Component, OnInit, Input } from '@angular/core';
import { CreateProductOption, ProductOption} from 'src/app/models/products.model';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ErrorService } from './../../../../services/error.service';
import { ProductsService } from './../../../../services/products/products.service';

@Component({
  selector: 'app-product-option',
  templateUrl: './product-option.component.html',
  styleUrls: ['./product-option.component.css','../../../../shared/css/spinner.css']
})
export class ProductOptionComponent implements OnInit {
  @Input() options: ProductOption[];
  @Input() productId:number;
  optionForm: FormGroup;
  errs: string[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private errorService:ErrorService,
    private productService: ProductsService
  ) { }

  ngOnInit():void{
    this.optionForm = this.fb.group({
      ShortDescription: ["", []],
      Title: ["", [Validators.required]],
      Value: ["", [Validators.required]],
      Cost: ["", [Validators.required]],
    });
  }

  addProductOption():void{
    if(this.controlsErrorExist()) return;
    let data:CreateProductOption;
    data = this.getProductOption();
    this.loading = true;
    this.productService.createProductOption(this.productId,data)
      .subscribe((a)=>{
      this.options.push(a.data);
      this.resetForm();
      this.loading = false;
    });

    // setTimeout(()=>{     
    //   this.options.push(data);
    //   this.resetForm();
    //   this.loading = false;
    // }, 1000);
  }

  removeOption(productId:number,optionId:any,index:number):void{
    this.options[index].loading = true;
    setTimeout(()=>{     
      this.options.splice(index,1);
    }, 1000);
  }

  controlsErrorExist():number{
    const controls = this.optionForm.controls;
    this.errs = this.errorService.getControlError(controls);
    return this.errs.length;
  }

  resetForm():void{
    this.optionForm.reset();
    Object.keys(this.optionForm.controls).forEach(key => {
      this.optionForm.get(key).setErrors(null);
      this.optionForm.get(key).updateValueAndValidity();
    });
  }

  getProductOption():CreateProductOption{
    return {
      "title":this.optionForm.get("Title").value,
      "value":this.optionForm.get("Value").value,
      "cost":this.optionForm.get("Cost").value,
      "shortDescription":this.optionForm
      .get("ShortDescription").value,
    } as CreateProductOption;
  }
}
