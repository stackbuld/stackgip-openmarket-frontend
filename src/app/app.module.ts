import { getLoggedInUser } from './helpers/userUtility';
import { SharedModule } from './shared/shared.module';
import { AppRouteModule } from './app-route.module';
import { BrowserModule } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { NgModule, inject, isDevMode } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth-interceptor';
import { ErrorHandlerInterceptor } from './shared/error-handler-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { toastOptions } from './services/toastr.service';
import { StoreModule } from '@ngrx/store';
import { counterReducer } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NgxPaginationModule } from './shared/pagination/ngx-pagination.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterModule } from '@angular/router';
import { datadogRum } from '@datadog/browser-rum';
import { WalletModule } from './shared/wallet/wallet.module';
import { provideClarity } from './helpers/ms-clarity';
import { AuthService } from './services/auth.service';
import { ClarityUnmaskDirective } from './shared/directives/clarity-unmask.directive';

if (environment.production) {
  //highlight integration

  // H.init(environment.highlightInfo.id, {
  //   environment: 'production',
  //   version: 'commit:' + environment.highlightInfo.commmitVersion,
  //   tracingOrigins: true,
  //   privacySetting: 'none',
  //   networkRecording: {
  //     enabled: true,
  //     recordHeadersAndBody: true,
  //     urlBlocklist: [
  //       'https://www.googleapis.com/identitytoolkit',
  //       'https://securetoken.googleapis.com',
  //     ],
  //   },
  // });

  datadogRum.init({
    applicationId: environment.dataDog.applicationId,
    clientToken: environment.dataDog.clientToken,
    site: 'datadoghq.eu',
    service: 'renamarket',
    env: '<ENV_NAME>',
    // Specify a version number to identify the deployed version of your application in Datadog
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  });
}

@NgModule({ declarations: [AppComponent, ClarityUnmaskDirective],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRouteModule,
        ToastrModule.forRoot(toastOptions),
        CommonModule,
        SharedModule,
        NgxSliderModule,
        NgxPaginationModule,
        MatPaginatorModule,
        StoreModule.forRoot({ counterReducer }, {
        // metaReducers: [storageSyncMetaReducer],
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        connectInZone: true}),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000',
        }),
        RouterModule,
        WalletModule],
        providers: [
          provideClientHydration(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
        },
        provideClarity({
            projectId: environment.msClarityProjectId,
            enabled: true,
        }),
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
