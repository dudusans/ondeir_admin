import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { ClassifiedsComponent } from './../../../../../ondeir_classifieds/classifieds/classifieds.component';
import { ListBrandsComponent } from './../../../../../ondeir_classifieds/mobile/list-brands/list-brands.component';
import { ListCarsComponent } from './../../../../../ondeir_classifieds/mobile/list-cars/list-cars.component';
import { ListCarsDetailsComponent } from './../../../../../ondeir_classifieds/mobile/list-cars-details/list-cars-details.component';
import { EstateTypeComponent } from './../../../../../ondeir_classifieds/mobile/estate-type/estate-type.component';
import { ListEstatesComponent } from '../../../../../ondeir_classifieds/mobile/list-estates/list-estates.component';
import { ListEstatesDetailsComponent } from '../../../../../ondeir_classifieds/mobile/list-estate-details/list-estates-details.component';

const routes: Routes = [
  {
    path: "",
    children: [
      { path: '', redirectTo: 'login' },

      { path: 'classifieds/cars/:id/:cityName/:userId', component: ListBrandsComponent },
      { path: 'classifieds/cars/:id/:cityName/:assembler/:userId', component: ListCarsComponent },
      { path: 'classifieds/cars/:id/:userId', component: ListCarsDetailsComponent },

      { path: 'classifieds/estates/:id/:cityName/:userId', component: EstateTypeComponent },
      { path: 'classifieds/estates/:id/:cityName/:userId/:type', component: ListEstatesComponent },
      { path: 'classifieds/estates/:id/:userId', component: ListEstatesDetailsComponent },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MobileRoutingModule {

}
