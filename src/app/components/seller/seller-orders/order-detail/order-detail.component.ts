import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { InvoiceModel } from 'src/app/models/invoice.model';
import { OrderService } from "../../../../services/order/order.service";
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from './../../../../services/invoice/invoice.service';
import { fullInvoiceStatus } from './../../../../models/invoice.model';
import { Observable } from 'rxjs';
import { UserService } from './../../../../services/user/user.service';
import { IUserResponse } from './../../../../models/IUserModel';
import { getLoggedInUser } from './../../../../helpers/userUtility';
import { ToastrService } from 'src/app/services/toastr.service';
import { Order } from './../../../../models/order.model';
import { OrderViewMoreComponent } from './../order-view-more/order-view-more.component';
import { UpdateDeliveryStatusComponent } from './../update-delivery-status/update-delivery-status.component';
import uikit from 'uikit';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  @ViewChild(OrderViewMoreComponent) orderViewMore: OrderViewMoreComponent;
  @ViewChild(UpdateDeliveryStatusComponent) updateDelivery: UpdateDeliveryStatusComponent;
  @ViewChild('closeUpdateStatus') closeUpdateStatus: ElementRef;
  user$: Observable<IUserResponse>
  filterType = fullInvoiceStatus;
  loginUser = getLoggedInUser();
  invoice: InvoiceModel;
  total: number;
  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private userService: UserService,
    private orderService: OrderService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get("id")
    let userId = this.route.snapshot.paramMap.get("user_id")
    this.invoiceService.getById(id).subscribe((d) => {
      this.invoice = d.data
      this.total = 0
      this.invoice.orders.forEach((a) => {
        this.total += a.total
      });
      this.user$ = this.userService.getUserById(userId)
    });
  }

  setViewMore(order:Order):void{
    this.orderViewMore.setOrder({order})
  }

  setOrderId(orderId:number,status:string):void{
    this.updateDelivery.type = status
    this.updateDelivery.setOrderId({orderId,status})
  }

  closeUpdateStatusModal():void{
    this.closeUpdateStatus.nativeElement.click()
  }

  isUpdatable(status:string):boolean{
    const blackList:string[] = ['pending','canceled']
    return !blackList.includes(status)
  }

  updateLocation(orderId:number):void{
    uikit.modal.prompt("Enter current location ", '')
    // todo api
    .then((location)=>console.log(location),()=>{})
  }

  canCancel(status:string):boolean{
    return status !== 'paid'
  }
}
