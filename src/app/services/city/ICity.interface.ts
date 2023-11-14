import { Observable } from 'rxjs';

export interface ICityService {
  getAllCities(): Observable<string[]>;
  searchCities(searchItem: string): Observable<string[]>;
}
