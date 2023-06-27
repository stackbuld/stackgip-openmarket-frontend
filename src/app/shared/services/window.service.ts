import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '../shared.module';

// This interface is optional, showing how you can add strong typings for custom globals.
// Just use "Window" as the type if you don't have custom global stuff
// export interface ICustomWindow extends Window {
//   __custom_global_stuff: string;
// }

function getWindow(): any {
  return window;
}

@Injectable()
export class WindowRefService {
  /**
   *
   */
  constructor(@Inject(WINDOW_TOKEN) private window: any) {}
  get nativeWindow() {
    return window;
  }
}

declare global {
  interface Window {
    prefinery: any;
  }
}
