import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl} from '@angular/forms';
import { ErrorService } from './../../../../services/error.service';
import { nigeriaSates } from './../../../../data/nigeriastates';
import { ProductShipment } from './../../../../models/products.model';
import { ProductsService } from './../../../../services/products/products.service';

@Component({
  selector: 'app-product-shipment',
  templateUrl: './product-shipment.component.html',
  styleUrls: ['./product-shipment.component.css','../../../../shared/css/spinner.css']
})
export class ProductShipmentComponent implements OnInit, OnChanges{
  @Input() shipments:ProductShipment[];
  @Input() productId:number;
  shipmentForm:FormGroup;
  shipmentEditForm: FormGroup;
  loading:boolean = false;
  errs: string[] = [];
  states: string[] = nigeriaSates.map((a) => a.name);

  constructor(
    private fb: FormBuilder,
    private errorService:ErrorService,
    private productService: ProductsService
  ) { }

  ngOnInit():void{
    this.shipmentForm = this.fb.group({
      State: ["", [Validators.required]],
      City: ["", [Validators.required]],
      Cost: ["", [Validators.required]],
    });
    this.shipmentEditForm = this.fb.group({
      shipments: this.fb.array([]),
    });
  }

  ngOnChanges(changes:SimpleChanges):void{
    if(changes.shipments && changes.shipments.currentValue){
        this.shipmentArray().clear();
        this.setEditForm(
          changes.shipments.currentValue as ProductShipment[]
        );
    }
  }

  shipmentArray():FormArray{
    return this.shipmentEditForm.get('shipments') as FormArray;
  }

  setEditForm(shipments:ProductShipment[]):void{
    shipments.forEach((shipment) => {
      this.shipmentArray().push(
        this.setEditFormGroup(shipment)
      )
    });
  }

  setEditFormGroup(shipment:ProductShipment):FormGroup{
    return this.fb.group({
      state: [shipment.state,[Validators.required]],
      city: [shipment.city,[Validators.required]],
      cost: [shipment.cost,[Validators.required]],
      productId:shipment.productId,editable:false,
      loading:false,editLoading:false,id:shipment.id,
    });
  }

  editShipment(index:number):void{
    this.shipmentArray().at(index).get('editable').setValue(true);
  }

  updateShipment(shipmentId:number,index:number):void{
    let shipmentControl:AbstractControl = this.shipmentArray().at(index);
    if(shipmentControl.invalid){
      this.errs = this.errorService.setControlEditError(
        ["State","City","Cost"],shipmentControl
      );
      return
    }
    shipmentControl.get('editLoading').setValue(true);
    const shipmentData = (({state,city,cost})=>({state,city,cost}))
    (shipmentControl.value) as ProductShipment;

    this.productService.UpdateProductShipment(shipmentId,shipmentData)
      .subscribe((a)=>{
        shipmentControl.patchValue({
          state:a.data.state,city:a.data.city,
          cost:a.data.cost,editable:false,editLoading:false
        });
    });
  }

  removeShipment(shipmentId:number,index:number):void{
    this.shipmentArray().at(index).get('loading').setValue(true)
    this.productService.deleteProductShipment(shipmentId)
    .subscribe((a)=>{this.shipmentArray().removeAt(index);});
  }

  addShipment():void{
    if(this.controlsErrorExist()) return;
    let data:ProductShipment = this.getShipment();
    this.loading = true;
    this.productService.createProductShipment(this.productId,data)
      .subscribe((a)=>{
      this.shipmentArray().push(this.setEditFormGroup(a.data));
      this.resetForm();
      this.loading = false;
    });
  }

  controlsErrorExist():number{
    const controls = this.shipmentForm.controls;
    this.errs = this.errorService.getControlError(controls);
    return this.errs.length;
  }

  resetForm():void{
    this.shipmentForm.reset();
    Object.keys(this.shipmentForm.controls).forEach(key => {
      this.shipmentForm.get(key).setErrors(null);
      this.shipmentForm.get(key).updateValueAndValidity();
    });
  }

  getShipment():ProductShipment{
    return {
      "state":this.shipmentForm.get("State").value,
      "city":this.shipmentForm.get("City").value,
      "cost":this.shipmentForm.get("Cost").value
    } as ProductShipment;
  }
}
