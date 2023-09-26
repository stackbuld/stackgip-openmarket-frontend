import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private showFooterSubject = new BehaviorSubject<boolean>(true);
  showFooter$ = this.showFooterSubject.asObservable();

  setShowFooter(value: boolean): void {
    this.showFooterSubject.next(value);
  }
}
