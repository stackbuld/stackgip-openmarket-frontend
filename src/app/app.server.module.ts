import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { AppShellComponent } from './app-shell/app-shell.component';
import 'localstorage-polyfill'
import nodeWindowPolyfill from 'node-window-polyfill';
nodeWindowPolyfill.register();
const routes: Routes = [ { path: 'shell', component: AppShellComponent }];



global['localStorage'] = localStorage;

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    RouterModule.forRoot(routes),
  ],
  bootstrap: [AppComponent],
  declarations: [
    AppShellComponent
  ],
})
export class AppServerModule {}
