import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OwnerComponent } from './owner.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
    { path: '', component: OwnerComponent },
    { path: 'details', component: DetailsComponent},
    { path: 'details/:id', component: DetailsComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OwnerRoutingModule {

}
