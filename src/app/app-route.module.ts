import { AuthGuard } from './guard/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const route: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () =>
      import('./modules/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'homepage',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'seller',
    loadChildren: () =>
      import('./modules/seller/seller.module').then((m) => m.SellerModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'buyer',
    loadChildren: () => {
      if (window.innerWidth < 920) {
        return import('./modules/buyer-mobile/buyer-mobile.module').then(
          (m) => m.BuyerMobileModule
        );
      } else {
        return import('./modules/buyer/buyer.module').then(
          (m) => m.BuyerModule
        );
      }
    },
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(route, {
      enableTracing: true,
      initialNavigation: 'enabledBlocking',
    }),
    CommonModule,
  ],
  exports: [RouterModule],
})
export class AppRouteModule {}
