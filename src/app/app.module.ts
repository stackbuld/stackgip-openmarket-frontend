import { SharedModule } from "./shared/shared.module";
import { AppRouteModule } from "./app-route.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { LayoutComponent } from "./shared/components/layout/layout.component";
import { HeaderComponent } from "./shared/components/header/header.component";
import { LoginComponent } from "./components/auth/login/login.component";
import { SiginupComponent } from "./components/auth/siginup/siginup.component";
import { AuthComponent } from "./components/auth/auth.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./shared/auth-interceptor";
import { ErrorHandlerInterceptor } from "./shared/error-handler-interceptor";
import { AccountConfirmationComponent } from "./components/auth/account-confirmation/account-confirmation.component";

import { ToastrModule } from "ngx-toastr";
import { toastOptions } from "./services/toastr.service";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { ForgetPasswordComponent } from "./components/auth/forget-password/forget-password.component";
import { StoreModule } from "@ngrx/store";
import { counterReducer } from "./reducers";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "../environments/environment";
import { storageSyncMetaReducer } from "ngrx-store-persist";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    LoginComponent,
    SiginupComponent,
    AuthComponent,
    AccountConfirmationComponent,
    ResetPasswordComponent,
    ForgetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRouteModule,
    ToastrModule.forRoot(toastOptions),
    CommonModule,
    SharedModule,

    StoreModule.forRoot(
      { counterReducer },
      {
        metaReducers: [storageSyncMetaReducer],
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
