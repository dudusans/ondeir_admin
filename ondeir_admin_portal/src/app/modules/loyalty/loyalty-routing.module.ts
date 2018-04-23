import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoyaltyComponent } from '../../../../../ondeir_fidelidade/loyalty/loyalty.component';
import { DetailsComponent } from '../../../../../ondeir_fidelidade/loyalty/details/details.component';

const routes: Routes = [
    { path: '', component: LoyaltyComponent},
    { path: 'details', component: DetailsComponent},
    { path: 'details/:id', component: DetailsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoyaltyRoutingModule {

}
