import { IPage } from "./../../models/products.model";
import { getLoggedInUser } from "./../../helpers/userUtility";
import { InvoiceService } from "src/app/services/invoice/invoice.service";

import { ProductsService } from "src/app/services/products/products.service";
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductModel } from "src/app/models/products.model";
import {
  InvoiceModel,
  OrderModel,
  invoiceStatus,
} from "./../../models/invoice.model";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

import * as _ from "lodash";
import { numberWithCommas } from './../../helpers/number-format';
@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  numberWithCommas:Function = numberWithCommas
  filteredInvoice: InvoiceModel[];
  filterType = invoiceStatus;
  invoices: InvoiceModel[];
  page: IPage;

  user = getLoggedInUser()
  maximumItem: number = 10;
  defaultPage:number = 1;
  pageNumber: number;
  search:string = "";
  categoryId:string = "";
  minValue: number = 10;
  maxValue: number = 500000;
  products: ProductModel[] = [];
  totalItemCount: number;
  form: FormGroup;
  keyword:string = ''
  category:string = ''
  // user: any;
  
  constructor(
    // private productService: ProductsService,
    private invoiceService: InvoiceService) {}
  ngOnInit(): void {
    // this.fetchNextProducts(this.defaultPage)
    const user = getLoggedInUser();
    if (user) {
      this.invoiceService.getUserInvoices(user.id).subscribe((data) => {
        this.invoices = data.data.data;
        this.filteredInvoice = this.invoices;
        this.page = data.data.pager;
      });
    }
  }
  sumOrders(orders: OrderModel[]) {
    return _.sumBy(orders, (o) => o.total)
      .toFixed(2)
      .toLocaleString();
  }
  formatDate(date) {
    return new Date(date).toLocaleString();
  }

  filter(filter) {
    if (filter == invoiceStatus.paid) {
      this.filteredInvoice = this.invoices.filter(
        (a) => a.status == invoiceStatus.paid
      );
    } else if (filter == invoiceStatus.pending) {
      this.filteredInvoice = this.invoices.filter(
        (a) => a.status == invoiceStatus.pending
      );
    } else if (filter == "others") {
      this.filteredInvoice = this.invoices.filter(
        (a) =>
          a.status != invoiceStatus.pending &&
          a.status != invoiceStatus.paid &&
          a.status != invoiceStatus.pending
      );
    } else if (filter == "all") {
      this.filteredInvoice = this.invoices;
    }
  }



  fetchNextProducts(pageNumber:number){
    this.invoiceService.getUserInvoices(
       this.user.id,pageNumber,
      this.maxValue
    ).subscribe((invoices) => {
        this.invoices = invoices.data.data;
        this.pageNumber = invoices.data.pager.pageNumber;
        this.totalItemCount = invoices.data.pager.totalItemCount;
      },error => console.error(error)
    );
}



// onSearch(data):void{
//   this.keyword = data.keyword
//   this.category = data.category
//   this.minValue = data.minValue
//   this.maxValue = data.maxValue
//   this.fetchNextProducts(this.defaultPage)
// }

}
