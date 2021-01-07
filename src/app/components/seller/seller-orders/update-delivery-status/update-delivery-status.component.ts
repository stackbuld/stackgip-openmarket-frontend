import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from './../../../../services/order/order.service';
import { ToastrService } from 'src/app/services/toastr.service';

@Component({
  selector: 'app-update-delivery-status',
  templateUrl: './update-delivery-status.component.html',
  styleUrls: ['./update-delivery-status.component.css']
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
    });
  }

  public setOrderId({orderId,status}):void{
    this.form.setValue({status:status.toLowerCase()});
    this.currentOrderId = orderId;
  }

  onSubmit():void{
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    }
    const status = this.form.get("status").value
    this.orderService.UpdateStatus(this.currentOrderId,status)
      .subscribe((o)=>{
        // console.log(o.data);
        this.toast.success("Status updated successfully");
        this.closed.emit()
      });
  }
}
