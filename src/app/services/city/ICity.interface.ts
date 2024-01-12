import { Observable } from 'rxjs';

export interface ICityService {
  getAllCities(storefrontSellerId: string): Observable<string[]>;
  searchCities(
    searchItem: string,
    storefrontSellerId: string
  ): Observable<string[]>;
}
