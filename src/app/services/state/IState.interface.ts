import { Observable } from 'rxjs';

export interface IStateService {
  getAllStates(storefrontSellerId: string): Observable<string[]>;
  searchStates(
    searchItem: string,
    storefrontSellerId: string
  ): Observable<string[]>;
}
