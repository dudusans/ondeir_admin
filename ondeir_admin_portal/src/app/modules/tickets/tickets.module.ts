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
import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketsComponent } from './../../../../../ondeir_tickets/tickets/tickets.component';
import { TicketGuard } from "../../shared/guard/ticket.guard";
import { TicketsService } from '../../../../../ondeir_tickets/shared/services/tickets.service';
import { EventsComponent } from './../../../../../ondeir_tickets/events/events.component';
import { EventDetailComponent } from './../../../../../ondeir_tickets/event-detail/event-detail.component';
import { SectorDetailComponent } from './../../../../../ondeir_tickets/sector-detail/sector-detail.component';
import { TicketTypeDetailComponent } from './../../../../../ondeir_tickets/tickettype-detail/tickettype-detail.component';
import { TicketSalesComponent } from './../../../../../ondeir_tickets/ticketsales/ticketsales.component';
import { TicketSalesDetailComponent } from './../../../../../ondeir_tickets/ticketsales-detail/ticketSales-detail.component';
import { TicketSalesSaleComponent } from './../../../../../ondeir_tickets/ticketsales-sale/ticketSales-sale.component';

import { M_EventsComponent } from './../../../../../ondeir_tickets/mobile/events/m-events.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TicketsRoutingModule,
    SharedModule,
    InputMaskModule,
    QRCodeModule,
    CurrencyMaskModule,
    NgbDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BootstrapSwitchModule.forRoot(),
    TimepickerModule.forRoot(),
    ImageUploadModule.forRoot()
  ],
  declarations: [
    TicketsComponent,
    EventsComponent,
    EventDetailComponent,
    SectorDetailComponent,
    TicketTypeDetailComponent,
    TicketSalesComponent,
    TicketSalesDetailComponent,
    TicketSalesSaleComponent,
    M_EventsComponent
  ],
  providers: [
    TicketGuard,
    TicketsService
  ]
})
export class TicketsModule {}
