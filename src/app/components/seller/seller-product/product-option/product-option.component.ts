import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CreateProductOption, ProductOption} from 'src/app/models/products.model';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl} from '@angular/forms';
import { ErrorService } from './../../../../services/error.service';
import { ProductsService } from './../../../../services/products/products.service';

@Component({
  selector: 'app-product-option',
  templateUrl: './product-option.component.html',
  styleUrls: ['./product-option.component.css','../../../../shared/css/spinner.css']
})
export class ProductOptionComponent implements OnInit, OnChanges {
  @Input() options: ProductOption[];
  @Input() productId:number;
  optionForm: FormGroup;
  optionEditForm: FormGroup;
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
    this.optionEditForm = this.fb.group({
      options: this.fb.array([])
    });
  }

  ngOnChanges(changes:SimpleChanges):void{
    if(changes['options'] && changes['options'].currentValue){
        this.optionArray().clear();
        this.setEditForm(
          changes['options'].currentValue as ProductOption[]
        );
    }
  }

  optionArray():FormArray{
    return this.optionEditForm.get('options') as FormArray;
  }

  setEditForm(options:ProductOption[]):void{
    options.forEach((option) => {
      this.optionArray().push(
        this.setEditFormGroup(option)
      )
    });
  }

  setEditFormGroup(option:ProductOption):FormGroup{
    return this.fb.group({
      id:option.id,
      title:[option.title,[Validators.required]],
      value:[option.value,[Validators.required]],
      cost:[option.cost,[Validators.required]],
      shortDescription:option.shortDescription,
      productId:option.productId,editable:false,
      loading:false,editLoading:false,
    });
  }

  addProductOption():void{
    if(this.controlsErrorExist()) return;
    let data:CreateProductOption;
    data = this.getProductOption();
    this.loading = true;
    this.productService.createProductOption(this.productId,data)
      .subscribe((a)=>{
      this.optionArray().push(this.setEditFormGroup(a.data));
      this.resetForm();
      this.loading = false;
    });
  }

  editOption(index:number):void{
    this.optionArray().at(index).get('editable').setValue(true);
  }

  updateOption(optionId:number,index:number):void{
    let optionControl:AbstractControl = this.optionArray().at(index);
    if(optionControl.invalid){
      this.errs = this.errorService.setControlEditError(
        ["Title","Value","Cost"],optionControl
      );
      return
    }
    optionControl.get('editLoading').setValue(true);
    const optionData = (({title,value,cost})=>({title,value,cost}))
    (optionControl.value) as ProductOption;

    this.productService.UpdateProductOption(optionId,optionData)
      .subscribe((a)=>{
        optionControl.patchValue({
          title:a.data.title,value:a.data.value,
          cost:a.data.cost,editable:false,editLoading:false
        });
    });
  }

  removeOption(optionId:number,index:number):void{
    this.optionArray().at(index).get('loading').setValue(true)
    this.productService.deleteProductOption(optionId)
    .subscribe((a)=>{this.optionArray().removeAt(index);});
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
