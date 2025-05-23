import {
  ProductModel,
  IPagerResponse,
  IApiResponseModel,
} from './products.model';
import { ResponseModel } from './../shared/models/ResponseModel';
// Generated by https://quicktype.io

export interface CreateInvoiceModel {
  userId: string;
  billingAddress: string;
  country: string;
  state: string;
  city: string;
  createOrderDto: CreateOrderDto[];
}

export interface CreateOrderDto {
  productId: string;
  unit: number;
  price: number;
  discount: number;
  shipments?: string;
  options?: string;
  paymentOption?: string;
}
// Generated by https://quicktype.io

export interface InvoiceModelResponse extends ResponseModel {
  data: InvoiceModel;
}
export interface CreateInvoiceModelResponse extends ResponseModel {
  data: InvoiceModel[];
}
export interface InvoiceModel {
  userId: string;
  billingAddress: string;
  country: string;
  state: string;
  city: string;
  status: string;
  orders: OrderModel[];
  id: number;
  transReferenceNo: string;
  createdOn: string;
  paymentOptionType: string;
  isActive: boolean;
  isDeleted: boolean;
}
export interface PagedResponseInvoiceModel extends IApiResponseModel {
  data: pagedInvoiceModel;
}

export interface pagedInvoiceModel extends IPagerResponse {
  data: InvoiceModel[];
}
export interface OrderModel {
  productId: number;
  unit: number;
  price: number;
  discount: number;
  total: number;
  invoiceId: number;
  id: number;
  status: string;
  paymentOption: string;
  createdOn: string;
  isActive: boolean;
  isDeleted: boolean;
  product: ProductModel;
  shipments?: any;
  options?: any;
}

// Generated by https://quicktype.io

export interface VerifyInvoiceResponseModel extends ResponseModel {
  data: VerifyInvoiceModel;
}

export interface VerifyInvoiceModel {
  invoiceAmount: number;
  amountPaid: number;
  code: string;
}

export const invoiceStatus = {
  insufficientPayment: 'InsufficientPayment',
  pending: 'Pending',
  paid: 'Paid',
  paymentCanceled: 'PaymentCanceled',
};

export const fullInvoiceStatus = {
  Paid: 'Paid',
  Confirmed: 'Confirmed',
  Canceled: 'Canceled',
  Refunded: 'Refunded',
  Deliver: 'Deliver',
  InTransit: 'InTransit',
  Pending: 'Pending',
};

export const invoiceStatusEnums = {
  pending: 0,
  paid: 1,
  insufficientPayment: 2,
  paymentCanceled: 3,
};
