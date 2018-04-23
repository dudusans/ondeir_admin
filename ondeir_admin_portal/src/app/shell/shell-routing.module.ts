import { LoyaltyComponent } from './../../../../ondeir_fidelidade/loyalty/loyalty.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShellComponent } from "./shell.component";

const routes: Routes = [
  {
    path: "", component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
      { path: 'owner', loadChildren: './owner/owner.module#OwnerModule' },
      { path: 'loyalty', loadChildren: '../modules/loyalty/loyalty.module#LoyaltyModule'},
      { path: 'offers', loadChildren: '../modules/offers/offers.module#OffersModule'},
      { path: 'admin', loadChildren: '../modules/admin/admin.module#AdminModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShellRoutingModule {}
