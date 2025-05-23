// Generated by https://quicktype.io

export interface AddToCartRequestModel {
  userId: string;
  referenceId: string;
  currencyCode: string;
  item: Item;
}

export interface Item {
  currencyCode: string;
  productId: string;
  unit: number;
  logisticCode: string;
  paymentOption: string;
  destination: Destination;
  selectedVarationIds: string[];
  selectedComplementaryProductId: string[];
}

export interface Destination {
  firstname: string;
  lastname: string;
  lat: string;
  lng: string;
  country: string;
  city: string;
  state: string;
  address: string;
  phoneNumber: string;
}

// Generated by https://quicktype.io

export interface AddToCartResponseModel {
  message: string;
  status: string;
  data: unknown;
  code: string;
  errors: string[];
}

// Generated by https://quicktype.io

export interface UpdateCartUnitRequest {
  userId: string;
  referenceId: string;
  productId: string;
  unit: number;
}

// Generated by https://quicktype.io

export interface DeleteCartResponseModel {
  message: string;
  status: string;
  data: unknown;
  code: string;
  errors: string[];
}
