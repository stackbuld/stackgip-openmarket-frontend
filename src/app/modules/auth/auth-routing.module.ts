import { SiginupComponent } from './siginup/siginup.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountConfirmationComponent } from './account-confirmation/account-confirmation.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SiginupComponent },
    { path: 'forget-password', component: ForgetPasswordComponent },
    { path: 'confirm-email', component: AccountConfirmationComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    {
      path: '**',
      redirectTo: '/auth/login',
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
