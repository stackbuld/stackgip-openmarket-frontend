import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from './../../../../services/order/order.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-update-delivery-status',
  templateUrl: './update-delivery-status.component.html',
  styleUrls: ['./update-delivery-status.component.css','../../../../shared/css/spinner.css']
})
export class UpdateDeliveryStatusComponent implements OnInit {
  @Input() type:string;
  @Output() closed = new EventEmitter();
  currentOrderId:string;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private orderService:OrderService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      status: ["", [Validators.required]],
      loading:false,
    });
  }

  public setOrderId({orderId,status}):void{
    this.form.get("status").setValue(status.toLowerCase());
    this.currentOrderId = orderId;
  }

  showConfirmed():boolean{
    const tabs:string[] = ['paid'];
    return (tabs.findIndex((i)=>i == this.type) == -1)?false:true;
  }

  showCanceled():boolean{
    const tabs:string[] = ['paid'];
    return (tabs.findIndex((i)=>i == this.type) == -1)?false:true;
  }

  showRefunded():boolean{
    const tabs:string[] = [];
    return (tabs.findIndex((i)=>i == this.type) == -1)?false:true;
  }

  showDeliver():boolean{
    const tabs:string[] = [];
    return (tabs.findIndex((i)=>i == this.type) == -1)?false:true;
  }

  showIntransit():boolean{
    const tabs:string[] = ['confirmed'];
    return (tabs.findIndex((i)=>i == this.type) == -1)?false:true;
  }

  showPending():boolean{
    const tabs:string[] = [];
    return (tabs.findIndex((i)=>i == this.type) == -1)?false:true;
  }

  onSubmit():void{
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    const status = this.form.get("status").value
    this.form.get("loading").setValue(true);
    this.orderService.UpdateStatus(this.currentOrderId,status)
      .subscribe((o)=>{
        // console.log(o.data);
        this.form.get("loading").setValue(false);
        this.toast.success("Status updated successfully");
        this.closed.emit()
      });
  }
}
