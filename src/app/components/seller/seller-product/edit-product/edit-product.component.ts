import {
  CreateProductOption,
  CreateShipmentModel,
  EditProductModel,
} from "./../../../../models/products.model";
import { CreateProductModel } from "../../../../models/products.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  productOptions: CreateProductOption[];
  productShipments: CreateShipmentModel[];
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
      category: ["", [Validators.required]],
      unit: [0, [Validators.required]],
      previousPrice: [0.0]
    });
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
    // productId = 148 //145
    this.productId = productId
    this.productService.getProductById(productId).subscribe((a)=>{
      const data:EditProductModel = a.data;
      // console.log(a.data);
      this.form.setValue({
        "name":data.name,
        "description":data.description,
        "price":data.price,
        "previousPrice":data.previousPrice,
        "category":data.category.id,
        "unit":data.unit
      });
      this.images = data.productImages

      this.productOptions = data.productOptions;
      this.productShipments = data.productShipments;
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
        // if(!a.data.category)
        // {
        //    a.data.category = {id:0,name:'no category set',imageUrl:'',createdOn:''};
        // }
        this.images = [];
        this.edited.emit(a.data);
        this.toast.success("product updated successfully");
        this.closed.emit();
      },
      (error) => {
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
      categoryId: this.form.get('category').value,
      userId: this.user.id,
    } as CreateProductModel
  }
}

