import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  public alert$ = new BehaviorSubject<boolean>(false);

  close(): void {
    this.alert$.next(true);
  }

  open(): void {
    this.alert$.next(false);
  }
}
