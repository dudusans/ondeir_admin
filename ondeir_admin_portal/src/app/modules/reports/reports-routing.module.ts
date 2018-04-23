import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsComponent } from '../../../../../ondeir_reports/clients/clients.component';
import { LoyaltyProgramsComponent } from '../../../../../ondeir_reports/loyalty-programs/loyalty-programs.component';
import { OffersCouponsComponent } from '../../../../../ondeir_reports/offers-coupons/offers-coupons.component';


const routes: Routes = [
    { path: 'clients', component: ClientsComponent  },
    { path: 'coupons', component: OffersCouponsComponent  },
    { path: 'programs', component: LoyaltyProgramsComponent  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportsRoutingModule {

}
