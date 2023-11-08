import { Observable } from 'rxjs';

export interface IStateService {
  getAllStates(): Observable<string[]>;
}
