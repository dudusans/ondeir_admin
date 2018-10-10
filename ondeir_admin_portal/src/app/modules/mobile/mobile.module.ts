import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { QRCodeModule } from 'angular2-qrcode';
import { InputMaskModule } from 'ng2-inputmask';
import { ImageUploadModule } from "angular2-image-upload";
import { CurrencyMaskModule } from "ng2-currency-mask";

import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';
import { MobileRoutingModule } from './mobile-routing.module';
import { ClassifiedGuard } from "../../shared/guard/classified.guard";
import { ClassifiedsService } from '../../../../../ondeir_classifieds/shared/services/classifieds.service';
import { ListBrandsComponent } from '../../../../../ondeir_classifieds/mobile/list-brands/list-brands.component';
import { ListCarsComponent } from '../../../../../ondeir_classifieds/mobile/list-cars/list-cars.component';
import { ListCarsDetailsComponent } from '../../../../../ondeir_classifieds/mobile/list-cars-details/list-cars-details.component';
import { PageHeaderClsComponent } from '../../../../../ondeir_classifieds/mobile/page-header-cls/page-header-cls.component';
import { EstateTypeComponent } from '../../../../../ondeir_classifieds/mobile/estate-type/estate-type.component';
import { ListEstatesComponent } from '../../../../../ondeir_classifieds/mobile/list-estates/list-estates.component';
import { ListEstatesDetailsComponent } from '../../../../../ondeir_classifieds/mobile/list-estate-details/list-estates-details.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MobileRoutingModule,
    SharedModule,
    InputMaskModule,
    QRCodeModule,
    CurrencyMaskModule,
    ImageUploadModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbCarouselModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [
    ListBrandsComponent,
    ListCarsComponent,
    ListCarsDetailsComponent,
    PageHeaderClsComponent,
    EstateTypeComponent,
    ListEstatesDetailsComponent,
    ListEstatesComponent
  ],
  exports: [
    PageHeaderClsComponent
  ],
  providers: [
    ClassifiedsService
  ]
})
export class MobileModule {}
