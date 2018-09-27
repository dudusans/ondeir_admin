import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { StoresComponent } from './../../../../../ondeir_classifieds/stores/stores.component';
import { ClassifiedsComponent } from './../../../../../ondeir_classifieds/classifieds/classifieds.component';
import { MyStoreComponent } from './../../../../../ondeir_classifieds/my-store/my-store.component';
import { ProductsComponent } from './../../../../../ondeir_classifieds/products/products.component';
import { ClassifiedGuard } from '../../shared/guard/classified.guard';
import { ProductDetailComponent } from './../../../../../ondeir_classifieds/product-detail/product-detail.component';
import { ContactsComponent } from './../../../../../ondeir_classifieds/contacts/contacts.component';
import { ListBrandsComponent } from './../../../../../ondeir_classifieds/mobile/list-brands/list-brands.component';
import { ListCarsComponent } from './../../../../../ondeir_classifieds/mobile/list-cars/list-cars.component';
import { ListCarsDetailsComponent } from './../../../../../ondeir_classifieds/mobile/list-cars-details/list-cars-details.component';
import { EstateTypeComponent } from './../../../../../ondeir_classifieds/mobile/estate-type/estate-type.component';
import { ListEstatesComponent } from '../../../../../ondeir_classifieds/mobile/list-estates/list-estates.component';
import { ListEstatesDetailsComponent } from '../../../../../ondeir_classifieds/mobile/list-estate-details/list-estates-details.component';

const routes: Routes = [
  {
    path: "", component: ClassifiedsComponent,
    children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: MyStoreComponent, canActivate: [ClassifiedGuard]},
      { path: 'stores', component: StoresComponent },
      { path: 'mystore/:id', component: MyStoreComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:type', component: ProductDetailComponent },
      { path: 'products/details/:type/:id', component: ProductDetailComponent },
      { path: 'contacts', component: ContactsComponent },

      { path: 'mobile/cars/:id/:cityName/:userId', component: ListBrandsComponent },
      { path: 'mobile/cars/:id/:cityName/:assembler/:userId', component: ListCarsComponent },
      { path: 'mobile/cars/:id/:userId', component: ListCarsDetailsComponent },

      { path: 'mobile/estates/:id/:cityName/:userId', component: EstateTypeComponent },
      { path: 'mobile/estates/:id/:cityName/:userId/:type', component: ListEstatesComponent },
      { path: 'mobile/estates/:id/:userId', component: ListEstatesDetailsComponent },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClassifiedsRoutingModule {

}
