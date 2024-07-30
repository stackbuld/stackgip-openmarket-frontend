import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  public alert$ = new BehaviorSubject<boolean>(false);

 public close(): void {
    this.alert$.next(true);
  }

  public open(): void {
    this.alert$.next(false);
  }
}
