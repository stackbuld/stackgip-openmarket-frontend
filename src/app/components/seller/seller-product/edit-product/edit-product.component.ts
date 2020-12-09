import {
  CreateProductOption,
  CreateShipmentModel,
  EditProductModel,
} from "./../../../../models/products.model";
import { CreateProductModel } from "../../../../models/products.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Component, OnInit, EventEmitter, Output} from "@angular/core";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { ProductsService } from "../../../../services/products/products.service";
import { CatgoryService } from "../../../../services/category/catgory.service";
import { ToastrService } from "./../../../../services/toastr.service";
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { CategoryResponse } from "./../../../../models/CategoryModels";

declare var cloudinary: any;
@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.css"],
})
export class EditProductComponent implements OnInit{
  @Output() closed = new EventEmitter();
  @Output() edited = new EventEmitter();

  form: FormGroup;
  categories$: Observable<CategoryResponse>;
  uploadWidget: any;
  productId: number;
  states: string[] = nigeriaSates.map((a) => a.name);
  images: string[] = [];
  user = getLoggedInUser();

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private catgoryService: CatgoryService,
    private productService: ProductsService, 
  ) {}

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.categories$ = this.catgoryService.GetCategory();
    this.uploadWidget = this.cloudinaryWidget();
    this.formInit();
  }

  cloudinaryWidget():any{
    return cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
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
      shipments: this.fb.array([]),
      options: this.fb.array([]),
    });
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
      shortDescription: ["",[Validators.required]],
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

  upload() {
    this.uploadWidget.open();
  }

  removeImage(image_url):void{
    this.images = this.images.filter(
      (a) => a !== image_url
    );
  }

  setProduct({productId}):void{
    this.productId = productId
    // this.productId = 145
    this.productService.getProductById(productId).subscribe((a)=>{
      const data:EditProductModel = a.data;
      // this.form.get('name').setValue(data.name);
      this.form.setValue({
        "name":data.name,
        "description":data.description,
        "price":data.price,
        "previousPrice":data.previousPrice,
        "category":data.category.id,
        "unit":data.unit,
        "shipments":[],
        "options":[],
      });
      this.images = data.productImages

      this.setShipments(data.productShipments as CreateShipmentModel[]);
      this.setOptions(data.productOptions as CreateProductOption[]);
    });
  }

  setShipments(shipments:CreateShipmentModel[]):void{
    shipments.forEach((shipment:CreateShipmentModel)=>{
       let fb = this.fb.group({
        countryCode: [shipment.countryCode,[Validators.required]],
        state: [shipment.state,[Validators.required]],
        city: [shipment.city,[Validators.required]],
        cost: [shipment.cost,[Validators.required]]
      });
      this.shipments().push(fb);
    });
  }

  setOptions(options:CreateProductOption[]):void{
    options.forEach((option:CreateProductOption)=>{
      let fb = this.fb.group({
        title: [option.title,[Validators.required]],
        shortDescription: [option.shortDescription,[Validators.required]],
        value: [option.value,[Validators.required]],
        cost: [option.cost,[Validators.required]]
      }); 
      this.options().push(fb);
    });
  }

  onSubmit():void{
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    const data: CreateProductModel  =  this.getProductUpdatedData();
    this.productService.UpdateProduct(this.productId,data).subscribe( 
      (a) => {
        if(!a.data.category)
        {
           a.data.category = {id:0,name:'no category set',imageUrl:'',createdOn:''};
        }
        this.images = [];
        this.edited.emit(a.data);
        this.toast.success("product updated successfully");
        this.closed.emit();
      },
      (error) => {
        // this.errors = error.error.errors.map((a) => a.description);
        console.log("error", error);
      }
     )
  }

  getProductUpdatedData():CreateProductModel{
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

