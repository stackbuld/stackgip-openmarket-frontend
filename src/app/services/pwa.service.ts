import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PwaService {
  promptEvent: Event;
  deferredPrompt: any;
  showModal = new Subject<boolean>();
  constructor(private swUpdate: SwUpdate) {}

  initPwaPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        this.showModal.next(true);
      } else {
        this.showModal.next(false);
      }
    });
  }

  showInstallPrompt() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        this.deferredPrompt = null;
      });
    }
  }
}
