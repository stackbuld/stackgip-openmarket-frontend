import { SharedModule } from './shared/shared.module';
import { AppRouteModule } from './app-route.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { NgAisModule } from 'angular-instantsearch';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouteModule,
    ToastrModule.forRoot(toastOptions),
    CommonModule,
    SharedModule,
    NgxSliderModule,
    NgxPaginationModule,

    MatPaginatorModule,

    NgAisModule.forRoot(),
    StoreModule.forRoot(
      { counterReducer },
      {
        // metaReducers: [storageSyncMetaReducer],
      }
    ),

    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    // {
    //   provide: "SocialAuthServiceConfig",
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider(environment.googleClientId),
    //       },
    //       {
    //         id: FacebookLoginProvider.PROVIDER_ID,
    //         provider: new FacebookLoginProvider(environment.facebookAppId),
    //       },
    //     ],
    //   } as SocialAuthServiceConfig,
    // },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
