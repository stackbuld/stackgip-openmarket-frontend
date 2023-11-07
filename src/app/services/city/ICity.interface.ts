import { Observable } from 'rxjs';

export interface ICityService {
  getAllCities(): Observable<string[]>;
}
