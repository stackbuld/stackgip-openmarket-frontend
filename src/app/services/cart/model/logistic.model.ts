export interface GetShippingPriceEstimateRequest {
  productId:   string;
  userId:      string;
  referenceId: string;
  requestId:   string;
  userAddress: UserAddress;
}

export interface UserAddress {
  fullAddress:         string;
  streetName:          string;
  state:               string;
  city:                string;
  town:                string;
  countryCode:         string;
  lga:                 string;
  zipCode:             string;
  lat:                 string;
  lng:                 string;
  customerPhoneNumber: string;
  firstName:           string;
  lastName:            string;
}

export interface GetShippingPriceEstimateResponse {
  message:   string;
  succeeded: boolean;
  data:      GetShippingPriceEstimateData[] | GetShippingEstimatePrice;
  status:    string;
  code:      string;
  errors:    any[];
}

export interface GetShippingPriceEstimateData {
  logisticCode:   string;
  estimatePrices: GetShippingEstimatePrice[];

}

export interface GetShippingEstimatePrice {
  logisticCode:     string;
  logisticLogoUrl:  string;
  logisticName:     string;
  deliveryDuration: string;
  startingPrice:    number;
  isSelected?: boolean
}

