import { InputMaskModule } from '../../../../node_modules/ng2-inputmask/src/input-mask.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { QRCodeModule } from 'angular2-qrcode';

import { OffersRoutingModule } from "./offers-routing.module";
import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';
import { OffersComponent } from '../../../../../ondeir_ofertas/offers/offers.component';
import { DetailsComponent } from '../../../../../ondeir_ofertas/offers/details/details.component';
import { OffersService } from '../../../../../ondeir_ofertas/shared/services/offers.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OffersRoutingModule,
    SharedModule,
    InputMaskModule,
    QRCodeModule,
    NgbDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [OffersComponent, DetailsComponent],
  providers: [
    OffersService
  ],
  entryComponents: [

  ],
})
export class OffersModule {}
