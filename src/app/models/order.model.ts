import { 
    ProductModel, CreateShipmentModel, 
    CreateProductOption, IApiResponseModel 
} from "./products.model";

export interface OrderResponce extends IApiResponseModel {
    data: OrderDetail[];
}

export interface OrderDetail {
    userId:         string;
    billingAddress: string;
    country:        string;
    state:          string;
    city:           string;
    status:         string;
    orders:         Order[];
    id:             number;
    createdOn:      Date;
    viewMore?:      boolean;
}

export interface Order {
    productId: number;
    product:   ProductModel;
    unit:      number;
    price:     number;
    discount:  number;
    total:     number;
    status:    string;
    invoiceId: number;
    id:        number;
    createdOn: Date;
}

export interface OrderProductModel extends ProductModel {
  productShipments: CreateShipmentModel[];
  productOptions: CreateProductOption[];
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