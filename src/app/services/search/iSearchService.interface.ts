import { Observable } from 'rxjs';
import {IProductPage, ProductsApiModel} from '../../models/products.model';

export interface ISearchProductResponse {
  category: {
    createdOn: string;
    description: string;
    id: number;
    imageUrl: string;
    name: string;
  }
  categoryId: string;
  createdOn: string;
  description: string;
  id: string;
  imageUrl: string;
  imageUrls: string[] | string;
  name: string;
  objectId: string;
  paymentOptions: string;
  previousPrice: number;
  price: number;
  productImages: string[];
  productOptions: unknown[];
  sellerStores: unknown[];
  sellingPrice: number;
  unit: number;
  userId: string;
  weight: number;
}


export interface  ISearchService{
  getProducts(pageNumber: number, maxItem: number, searchQuery: string, categoryId: string, minPrice: number, maxPrice: number): Observable<IProductPage>
}

