import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { BootstrapSwitchModule } from 'angular2-bootstrap-switch';
import { QRCodeModule } from 'angular2-qrcode';
import { InputMaskModule } from 'ng2-inputmask';

import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';
import { ClassifiedsRoutingModule } from './classified-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClassifiedsRoutingModule,
    SharedModule,
    InputMaskModule,
    QRCodeModule,
    NgbDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [

  ],
  providers: [

  ]
})
export class ClassifiedsModule {}
