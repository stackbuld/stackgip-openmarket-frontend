import { AccountConfirmationComponent } from "./components/account-confirmation/account-confirmation.component";
import { AuthComponent } from "./components/auth/auth.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
const route: Routes = [
  { path: "auth", component: AuthComponent },

  // {path : 'forget-password', component: ForgetPasswordComponent},
  { path: "confirm-email", component: AccountConfirmationComponent },
  { path: "confirm", component: AccountConfirmationComponent },
  // {path : 'reset-password', component: ResetPasswordComponent},
  // {path : 'ResetPassword', component: ResetPasswordComponent},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(route, { enableTracing: true }), CommonModule],
  exports: [RouterModule],
})
export class AppRouteModule {}
