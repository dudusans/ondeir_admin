import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { StoresComponent } from './../../../../../ondeir_classifieds/stores/stores.component';
import { ClassifiedsComponent } from './../../../../../ondeir_classifieds/classifieds/classifieds.component';
import { MyStoreComponent } from './../../../../../ondeir_classifieds/my-store/my-store.component';
import { ClassifiedGuard } from '../../shared/guard/classified.guard';

const routes: Routes = [
  {
    path: "", component: ClassifiedsComponent,
    children: [
      { path: '', redirectTo: 'home' },
      { path: 'home', component: MyStoreComponent, canActivate: [ClassifiedGuard]},
      { path: 'stores', component: StoresComponent }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClassifiedsRoutingModule {

}
