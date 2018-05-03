import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { QRCodeModule } from 'angular2-qrcode';
import { InputMaskModule } from 'ng2-inputmask';
import { ImageUploadModule } from "angular2-image-upload";
import { CurrencyMaskModule } from "ng2-currency-mask";

import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';
import { ClassifiedsRoutingModule } from './classified-routing.module';
import { StoresComponent } from './../../../../../ondeir_classifieds/stores/stores.component';
import { ClassifiedsComponent } from './../../../../../ondeir_classifieds/classifieds/classifieds.component';
import { MyStoreComponent } from './../../../../../ondeir_classifieds/my-store/my-store.component';
import { ClassifiedGuard } from "../../shared/guard/classified.guard";
import { ClassifiedsService } from '../../../../../ondeir_classifieds/shared/services/classifieds.service';
import { ProductDetailComponent } from "../../../../../ondeir_classifieds/product-detail/product-detail.component";
import { ProductsComponent } from "../../../../../ondeir_classifieds/products/products.component";
import { ContactsComponent } from "../../../../../ondeir_classifieds/contacts/contacts.component";
import { ProductEstatesComponent } from '../../../../../ondeir_classifieds/product-detail/product-estates/product-estates.component';
import { ProductAutoComponent } from '../../../../../ondeir_classifieds/product-detail/product-auto/product-auto.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClassifiedsRoutingModule,
    SharedModule,
    InputMaskModule,
    QRCodeModule,
    CurrencyMaskModule,
    ImageUploadModule.forRoot(),
    NgbDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [
    StoresComponent,
    ClassifiedsComponent,
    MyStoreComponent,
    ProductDetailComponent,
    ProductsComponent,
    ContactsComponent,
    ProductAutoComponent,
    ProductEstatesComponent
  ],
  providers: [
    ClassifiedGuard,
    ClassifiedsService
  ]
})
export class ClassifiedsModule {}
