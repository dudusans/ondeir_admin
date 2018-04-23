import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { QRCodeModule } from 'angular2-qrcode';
import { InputMaskModule } from 'ng2-inputmask';

import { LoyaltyRoutingModule } from './loyalty-routing.module';
import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';
import { LoyaltyComponent } from '../../../../../ondeir_fidelidade/loyalty/loyalty.component';
import { DetailsComponent } from './../../../../../ondeir_fidelidade/loyalty/details/details.component';
import { LoyaltyService } from './../../../../../ondeir_fidelidade/shared/services/loyalty.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoyaltyRoutingModule,
    SharedModule,
    InputMaskModule,
    QRCodeModule,
    NgbDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [
    LoyaltyComponent,
    DetailsComponent
  ],
  providers: [
    LoyaltyService
  ]
})
export class LoyaltyModule {}
