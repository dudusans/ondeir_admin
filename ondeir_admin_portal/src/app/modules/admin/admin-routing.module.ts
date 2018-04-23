import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemsComponent } from '../../../../../ondeir_admin/systems/systems.component';
import { SystemDetailsComponent } from '../../../../../ondeir_admin/system-details/system-details.component';

const routes: Routes = [
    { path: 'systems', component: SystemsComponent },
    { path: 'systems/details', component: SystemDetailsComponent },
    { path: 'systems/details/:id', component: SystemDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {

}
