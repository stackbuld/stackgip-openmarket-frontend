import { ResponseModel } from "./../../shared/models/ResponseModel";
import { Observable } from "rxjs";
import {
  CreateInvoiceModel,
  InvoiceModelResponse,
  VerifyInvoiceResponseModel,
  pagedInvoiceModel,
  PagedResponseInvoiceModel,
} from "./../../models/invoice.model";
import { HttpClient } from "@angular/common/http";
import { ApiAppUrlService } from "./../api-app-url.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  baseUrl: string;
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
    this.baseUrl = apiUrls.ecommerceBaseUrl;
  }

  createInvoice(
    createInvoiceModel: CreateInvoiceModel
  ): Observable<InvoiceModelResponse> {
    return this.http.post<InvoiceModelResponse>(
      this.baseUrl + "invoice",
      createInvoiceModel
    );
  }

  getById(id: any): Observable<InvoiceModelResponse> {
    return this.http.get<InvoiceModelResponse>(this.baseUrl + "invoice/" + id);
  }

  verifyInvoice(invoiceId): Observable<VerifyInvoiceResponseModel> {
    return this.http.get<VerifyInvoiceResponseModel>(
      this.baseUrl + `invoice/${invoiceId}/verifypayment`
    );
  }

  updateStatus(invoiceId, statusEnum): Observable<ResponseModel> {
    return this.http.patch<ResponseModel>(
      this.baseUrl + `invoice/${invoiceId}/status/${statusEnum}`,
      {}
    );
  }

  getUserInvoices(userId: string): Observable<PagedResponseInvoiceModel> {
    return this.http.get<PagedResponseInvoiceModel>(
      this.baseUrl + `invoice/user/${userId}`
    );
  }
}
