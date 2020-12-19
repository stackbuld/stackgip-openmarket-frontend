import { Component, OnInit, Input} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ErrorService } from './../../../../services/error.service';
import { nigeriaSates } from './../../../../data/nigeriastates';
import { CreateShipmentModel } from './../../../../models/products.model';
import { ProductsService } from './../../../../services/products/products.service';

@Component({
  selector: 'app-product-shipment',
  templateUrl: './product-shipment.component.html',
  styleUrls: ['./product-shipment.component.css','../../../../shared/css/spinner.css']
})
export class ProductShipmentComponent implements OnInit {
  @Input() shipments:CreateShipmentModel & {loading?: boolean}[];
  shipmentForm:FormGroup;
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
  }

  removeOption(productId:number,shipmentId:any,index:number):void{
    this.shipments[index].loading = true;
    setTimeout(()=>{     
      this.shipments.splice(index,1);
    }, 1000);
  }

  addShipment():void{
    if(this.controlsErrorExist()) return;
    let data:CreateShipmentModel & {loading?: boolean};
    data = this.getShipment();
    this.loading = true;
    setTimeout(()=>{     
      this.shipments.push(data);
      this.resetForm();
      this.loading = false;
    }, 1000);
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

  getShipment():CreateShipmentModel & {loading?: boolean}{
    return {
      "state":this.shipmentForm.get("State").value,
      "city":this.shipmentForm.get("City").value,
      "cost":this.shipmentForm.get("Cost").value
    } as CreateShipmentModel & {loading?: boolean};
  }
}
