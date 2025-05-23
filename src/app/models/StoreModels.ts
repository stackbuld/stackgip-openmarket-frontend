export interface IStore {}

// Generated by https://quicktype.io

export interface StoreResponse {
  message: string;
  status: string;
  // data: IStore[];
  data: any;
}

export interface SellerBaseResponse<T> {
  status: string;
  data: T;
}

export interface SellerStores {
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
  storeName?: string;
  landmark?: string;
  productCount: number;
  postalCode?: any;
  storeAvailabilties: {
    dayOfWeek: string;
    openingTime: string;
    closingTime: string;
  }[];
}

export interface CartAddress {
  id?: string;
  firstname: string;
  lastname: string;
  fullAddress: string;
  lat: string | number;
  lng: string | number;
  city: string;
  state: string;
  country: string;
  userId?: string;
  contactPhoneNumber: string;
  isDefault?: boolean;
  createdOn?: string;
}

export interface StoreAvailability {
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}
