import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { isDevMode } from '@angular/core';

function bootstrap() {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => {
      isDevMode() && console.error(err);
    });
}

if (document.readyState === 'complete') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
