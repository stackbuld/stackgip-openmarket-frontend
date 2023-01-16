import {
  CreateProductResponse,
} from "./../../../../models/products.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CreateProductModel } from "../../../../models/products.model";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { variations } from "src/app/data/productVariations";
import { ProductsService } from "../../../../services/products/products.service";
import { CatgoryService } from "../../../../services/category/catgory.service";
import { ToastrService } from "./../../../../services/toastr.service";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { CategoryResponse } from "./../../../../models/CategoryModels";
import { StoreService } from "src/app/services/store/store.service";
import { StoreResponse } from "src/app/models/StoreModels";

declare var cloudinary: any;
@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss","../../../../shared/css/spinner.css"],
})
export class AddProductComponent implements OnInit {
  
  @Output() closed = new EventEmitter();
  @Output() added = new EventEmitter();
  errors: any[];
  errorMessage: string;
  form: FormGroup;
  cproduct: CreateProductResponse;
  categories$: Observable<CategoryResponse>;
  stores$: Observable<StoreResponse>;
  loading: boolean = false;
  uploadWidget: any;
  images = [];
  states: string[] = nigeriaSates.map((a) => a.name);
  productVariations: string[] = variations;
  user = getLoggedInUser();

  constructor(
    private fb: FormBuilder, 
    private toast: ToastrService,
    private productService: ProductsService, 
    private catgoryService: CatgoryService,
    private storeService: StoreService
  ){this.formInit()}
  get f() {return this.form.controls;}

  ngOnInit(): void {
    this.categories$ = this.catgoryService.GetCategory();
    this.stores$ = this.storeService.getStoresByUserId(this.user.id);
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg','jpg','png','gif'],
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
      weight: [0.0],
      previousPrice: [0.0],
      category: ["", [Validators.required]],
      storeIds: [[], [Validators.required]],
      unit: [0, [Validators.required]],
      variations: this.fb.array([this.createVariation()]),
      options: this.fb.array([]),
    });
  }

  variations():FormArray{
    return this.form.get('variations') as FormArray;
  }

  createVariation():FormGroup{
    return this.fb.group({
      title: ["",[Validators.required]],
      value: ["",[Validators.required]],
      cost: [0.0,[Validators.required]]
    });
  }

  addVariation():void{ 
    this.variations().push(this.createVariation());
  }

  removeVariation(index:number):void{
    this.variations().removeAt(index);
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
    this.errors = []
    this.errorMessage = ""
    if (this.form.invalid) {
      console.log(this.form.errors)
      return
    }
    if(this.images.length < 1){
      this.toast.error("product image is required")
      return
    }
    this.loading = true
    const data: CreateProductModel  =  this.getProductData()
    
    this.productService.createProduct(data).subscribe( 
      (a) => {
        this.images = []
        this.added.emit(a.data)
        this.toast.success("product created successfully")
        this.loading = false
        this.closed.emit()
      },
      (error) => {
        // this.errors = error.error.errors.map((a) => a.description);
        console.log("error", error)
      }
     )
  }

  flatPaymentOption(option:{method:boolean,value:string,label:string}[]){
    return option.filter(opt=>opt.method).map(opt=>opt.value).join(',')
  }

  getProductData():CreateProductModel{
    return {
      name: this.form.get("name").value,
      price: this.form.get("price").value,
      previousPrice: this.form.get("previousPrice").value,
      description: this.form.get("description").value,
      categoryId: this.form.get('category').value,
      imageUrl: this.images[0],
      unit: this.form.get("unit").value,
      weight: this.form.get("weight").value,
      userId: this.user.id,
      imageUrls: this.images,
      storeIds: this.form.get('storeIds').value,
      options: [
        ...this.form.get("variations").value,
        ...this.form.get("options").value
      ]
      // shipments: this.form.get("shipments").value,
      // paymentOptions: this.flatPaymentOption(this.form.get("paymentOption").value)
    } as CreateProductModel
  }
}
