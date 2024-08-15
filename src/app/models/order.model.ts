import {
  ProductModel,
  CreateShipmentModel,
  IPagerResponse,
  CreateProductOption,
  IApiResponseModel,
  ProductOptions,
} from './products.model';
import { UserResponse } from './IUserModel';
import { Observable } from 'rxjs';
import { ApiResponse } from '../shared/models/IResponseModel';

export interface OrderResponce extends IApiResponseModel {
  data: OrderDetail[];
}

export interface OrderApiModel extends IApiResponseModel {
  data: IOrderPage;
}

export interface IOrderPage extends IPagerResponse {
  data: OrderDetail[];
}

export interface OrderDetail {
  userId: string;
  billingAddress: string;
  country: string;
  state: string;
  city: string;
  status: string;
  orders: Order[];
  id: number;
  createdOn: Date;
  viewMore?: boolean;
  user$?: Observable<ApiResponse<UserResponse>>;
}

export interface OrderDetail2 {
  productId: string;
  cartProduct: {
    productId: string;
    product: {
      name: string;
      price: number;
      categoryId: string;
      category: any;
      imageUrl: string;
      weight: number;
      paymentOptions: string;
      id: string;
      createdOn: string;
    };
    unit: number;
    storeId: string;
    destination: {
      firstname: string;
      lastname: string;
      lat: number;
      lng: number;
      countryCode: string;
      city: string;
      state: string;
      fullAddress: string;
      phoneNumber: string;
    };
    logistic: {
      logisticId: string;
      logisticCode: string;
      logisticLogo: string;
      logisticName: string;
      estimateShippingCost: number;
    };
    paymentOption: string;
    varations: ProductOptions[];
    complementaryProducts: ProductOptions[];
    logisticCode: string;
    shippingCost: {
      cost: number;
      discount: number;
    };
    discount: number;
    total: number;
  };
  unit: number;
  orderStatus: string;
  deliveryStatus: string;
  paymentStatus: string;
  orderNo: string;
  expectedDeliveryTimeline: any;
  invoice: {
    userId: string;
    paymentStatus: string;
    transReferenceNo: string;
    totalAmountPayable: number;
    totalAmountPaid: number;
    totalShippingCost: number;
    fee: number;
    totalDiscount: number;
    id: string;
    createdOn: string;
  };
  invoiceId: string;
  paymentReferenceNumber: string;
  destination: {
    firstname: string;
    lastname: string;
    lat: number;
    lng: number;
    country: string;
    city: string;
    state: string;
    address: string;
    phoneNumber: string;
  };
  pickUpAddress: {
    firstname: string;
    lastname: string;
    fullAddress: string;
    lat: number;
    lng: number;
    city: string;
    state: string;
    country: string;
    isDefault: boolean;
    userId: string;
    contactPhoneNumber: string;
    id: string;
    createdOn: string;
    createdBy: any;
    updatedBy: any;
    deletedBy: any;
    updatedOn: any;
    deletedOn: any;
    isActive: boolean;
    isDeleted: boolean;
  };
  logistic: {
    logisticId: string;
    logisticCode: string;
    logisticLogo: string;
    logisticName: string;
    estimateShippingCost: number;
  };
  logisticCode: string;
  shippingCost: number;
  fee: number;
  amountPaid: number;
  productAmount: number;
  discount: number;
  total: number;
  acceptOrderInfo: {
    photoUrl: null;
    videoUrl: null;
    serialNumber: null;
    additionalInformation: null;
    rejectionReason: null;
  };
  deliveryTrackingEvents: {
    dateTime: string;
    remark: string;
    status: string;
    eventType: string;
  }[];
  userId: string;
  sellerId: string;
  id: string;
  refund?: Refund;
  createdOn: string;
}

export interface Refund {
  orderNumber: string;
  id: string;
  refundStatus: string;
  reasonForRefund: string | null;
  reasonForRejection: string | null;
  imageUrls: string[];
  videoUrl: string;
  buyerId: string;
  buyerFirstname: string | null;
  buyerLastname: string | null;
  buyerPhoneNumber: string | null;
  buyerEmail: string | null;
  productAmountRefunded: number;
  shippingCostRefunded: number;
  unit: number;
  created: any;
}

export interface Order {
  productId: number;
  product: ProductModel;
  unit: number;
  price: number;
  discount: number;
  total: number;
  status: string;
  invoiceId: number;
  id: number;
  createdOn: Date;
}

export interface OrderProductModel extends ProductModel {
  productShipments: CreateShipmentModel[];
  productOptions: CreateProductOption[];
}

export interface OrderStatus {
  status?: string;
  reason?: string;
  itemLocationInfo?: string;
}

export interface OrderAcceptRejectPayload {
  orderId: string;
  photoUrl: string;
  videoUrl: string;
  serialNumber: string;
  additionalInformation: string;
  rejectionReason: string;
  isConfirmed: boolean;
  pickupDate: string;
}

// export interface Product {
//     name:             string;
//     price:            number;
//     previousPrice:    number;
//     description:      string;
//     categoryId:       number;
//     imageUrl:         string;
//     unit:             number;
//     productImages:    any[];
//     productShipments: any[];
//     productOptions:   any[];
//     id:               number;
//     createdOn:        Date;
// }
