import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { StoresComponent } from './../../../../../ondeir_classifieds/stores/stores.component';
import { ClassifiedsComponent } from './../../../../../ondeir_classifieds/classifieds/classifieds.component';
import { MyStoreComponent } from './../../../../../ondeir_classifieds/my-store/my-store.component';
import { ProductsComponent } from './../../../../../ondeir_classifieds/products/products.component';
import { ClassifiedGuard } from '../../shared/guard/classified.guard';
import { ProductDetailComponent } from './../../../../../ondeir_classifieds/product-detail/product-detail.component';
import { ContactsComponent } from './../../../../../ondeir_classifieds/contacts/contacts.component';

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
      { path: 'products/:type/:id', component: ProductDetailComponent },
      { path: 'contacts', component: ContactsComponent },
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClassifiedsRoutingModule {

}
