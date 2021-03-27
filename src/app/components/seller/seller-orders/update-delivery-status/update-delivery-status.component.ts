import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from './../../../../services/order/order.service';
import { ToastrService } from 'src/app/services/toastr.service';
import uikit from 'uikit';

@Component({
  selector: 'app-update-delivery-status',
  templateUrl: './update-delivery-status.component.html',
  styleUrls: ['./update-delivery-status.component.css','../../../../shared/css/spinner.css']
})
export class UpdateDeliveryStatusComponent implements OnInit {
  type:string = "";
  @Output() closed = new EventEmitter()
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
    this.form.get("status").setValue(status.toLowerCase())
    this.currentOrderId = orderId;
  }

  showPaid():boolean{
    const tabs:string[] = [];
    return tabs.includes(this.type.toLowerCase())
  }

  showConfirmed():boolean{
    const tabs:string[] = ['paid'];
    return tabs.includes(this.type.toLowerCase())
  }

  showCanceled():boolean{
    const tabs:string[] = ['paid','confirmed','intransit']
    return tabs.includes(this.type.toLowerCase())
  }

  showRefunded():boolean{
    const tabs:string[] = [];
    return tabs.includes(this.type.toLowerCase())
  }

  showDeliver():boolean{
    const tabs:string[] = [];
    return tabs.includes(this.type.toLowerCase())
  }

  showIntransit():boolean{
    const tabs:string[] = ['confirmed'];
    return tabs.includes(this.type.toLowerCase())
  }

  showPending():boolean{
    const tabs:string[] = [];
    return tabs.includes(this.type.toLowerCase())
  }

  onSubmit():void{
    if (this.form.invalid) {
      console.log(this.form.errors)
      return;
    }
    const status = this.form.get("status").value
    this.form.get("loading").setValue(true)
    if(status == 'canceled'){
      uikit.modal.confirm(
        'Are you sure that you want to cancel this order (cannot be reversed) ?'
      ).then(()=>{
        this.orderService.UpdateStatus(this.currentOrderId,status)
        .subscribe((o)=>{
          this.form.get("loading").setValue(false)
          if(this.type.toLowerCase() === 'intransit'){
            this.toast.warining("This action will reduce your trust quality on the platform !!!")
          }
          this.toast.success("Status updated successfully")
          this.closed.emit()
        })
        },()=>{this.form.get("loading").setValue(false)}
      )
    }else{
    this.orderService.UpdateStatus(this.currentOrderId,status)
      .subscribe((o)=>{
        this.form.get("loading").setValue(false)
        this.toast.success("Status updated successfully")
        this.closed.emit()
      })
    }
  }
}
