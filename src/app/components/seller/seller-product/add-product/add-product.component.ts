import {
  CreateProductResponse,
} from "./../../../../models/products.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CreateProductModel } from "../../../../models/products.model";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { ProductsService } from "../../../../services/products/products.service";
import { CatgoryService } from "../../../../services/category/catgory.service";
import { ToastrService } from "./../../../../services/toastr.service";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { CategoryResponse } from "./../../../../models/CategoryModels";

declare var cloudinary: any;
@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css","../../../../shared/css/spinner.css"],
})
export class AddProductComponent implements OnInit {
  
  @Output() closed = new EventEmitter();
  @Output() added = new EventEmitter();
  errors: any[];
  errorMessage: string;
  form: FormGroup;
  cproduct: CreateProductResponse;
  categories$: Observable<CategoryResponse>;
  loading: boolean = false;
  uploadWidget: any;
  images = [];
  states: string[] = nigeriaSates.map((a) => a.name);
  user = getLoggedInUser();

  constructor(
    private fb: FormBuilder, 
    private toast: ToastrService,
    private productService: ProductsService, 
    private catgoryService: CatgoryService
  ){this.formInit()}
  get f() {return this.form.controls;}

  ngOnInit(): void {
    this.categories$ = this.catgoryService.GetCategory();
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          // console.log("Done! Here is the image info: ", result.info);
          this.images.push(result.info.secure_url);
        }
      }
    );
  }

  formInit():void{
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: [0.0, [Validators.required]],
      previousPrice: [0.0],
      category: ["", [Validators.required]],
      unit: [0, [Validators.required]],
      shipments: this.fb.array([this.createShipment()]),
      options: this.fb.array([]),
      paymentOption: this.fb.array(this.setPaymentOption()),
    });
  }

  paymentOption():FormArray{
    return this.form.get('paymentOption') as FormArray;
  }

  setPaymentOption():FormGroup[]{
    return [
      this.fb.group({ method: [true, []], value:"online", label:"Pay Online" }),
      this.fb.group({ method: [false, []], value:"ondelivery", label:"Pay On Delivery" }),
    ]
  }

  shipments():FormArray{
    return this.form.get('shipments') as FormArray;
  }

  createShipment():FormGroup{
    return this.fb.group({
      countryCode: ["ng",[Validators.required]],
      state: ["all",[Validators.required]],
      city: ["all",[Validators.required]],
      cost: [0.0,[Validators.required]]
    });
  }

  addShipment():void{ 
    this.shipments().push(this.createShipment());
  }

  removeShipment(index:number):void{
    this.shipments().removeAt(index);
  }

  options():FormArray{
    return this.form.get('options') as FormArray;
  }

  createOptions():FormGroup{
    return this.fb.group({
      title: ["",[Validators.required]],
      shortDescription: ["",[]], 
      value: ["",[Validators.required]],
      cost: [0.0,[Validators.required]]
    });
  }

  addProductOption():void{
    this.options().push(this.createOptions());
  }

  removeOption(index:number):void{
    this.options().removeAt(index);
  }
  
  upload():void{
    this.uploadWidget.open();
  }

  removeImage(image_url):void{
    this.images = this.images.filter(
      (a) => a !== image_url
    );
  }
  
  onSubmit():void{
    this.errors = [];
    this.errorMessage = "";
    // console.log(
      //this.flatPaymentOption(this.form.get("paymentOption").value)
    // )
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    this.loading = true
    const data: CreateProductModel  =  this.getProductData();
    this.productService.createProduct(data).subscribe( 
      (a) => {
        this.images = [];
        this.added.emit(a.data);
        this.toast.success("product created successfully");
        this.loading = false
        this.closed.emit();
      },
      (error) => {
        // this.errors = error.error.errors.map((a) => a.description);
        console.log("error", error);
      }
     )
  }

  flatPaymentOption(option:{method:boolean,value:string,label:string}[]){
    return option.filter(opt=>opt.method).map(opt=>opt.value)
  }

  getProductData():CreateProductModel{
    return {
      name: this.form.get("name").value,
      price: this.form.get("price").value,
      previousPrice: this.form.get("previousPrice").value,
      description: this.form.get("description").value,
      unit: this.form.get("unit").value,
      imageUrl: this.images[0],
      imageUrls: this.images,
      shipments: this.form.get("shipments").value,
      options: this.form.get("options").value,
      categoryId: this.form.get('category').value,
      userId: this.user.id,
    } as CreateProductModel
  }
}
