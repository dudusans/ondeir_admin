import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputMaskModule } from "ng2-inputmask";
import { ModalModule } from 'ngx-bootstrap';

import { ReportsRoutingModule } from './reports-routing.module';
import { LoyaltyProgramsComponent } from '../../../../../ondeir_reports/loyalty-programs/loyalty-programs.component';
import { OffersCouponsComponent } from '../../../../../ondeir_reports/offers-coupons/offers-coupons.component';
import { ClientsComponent } from '../../../../../ondeir_reports/clients/clients.component';
import { SharedModule } from '../../../../../ondeir_admin_shared/shared.module';
import { ReportsService } from '../../../../../ondeir_reports/shared/services/reports.service';
import { ReportShellComponent } from '../../../../../ondeir_reports/report-shell/report-shell.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    InputMaskModule,
    ModalModule.forRoot()
  ],
  declarations: [
    LoyaltyProgramsComponent,
    OffersCouponsComponent,
    ClientsComponent,
    ReportShellComponent
  ],
  providers: [
    ReportsService
  ]
})
export class ReportsModule {}
