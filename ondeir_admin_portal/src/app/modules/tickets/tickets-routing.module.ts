import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketGuard } from '../../shared/guard/ticket.guard';
import { TicketsComponent } from './../../../../../ondeir_tickets/tickets/tickets.component';
import { EventsComponent } from './../../../../../ondeir_tickets/events/events.component';
import { EventDetailComponent } from './../../../../../ondeir_tickets/event-detail/event-detail.component';
import { SectorDetailComponent } from './../../../../../ondeir_tickets/sector-detail/sector-detail.component';
import { TicketTypeDetailComponent } from './../../../../../ondeir_tickets/tickettype-detail/tickettype-detail.component';
import { TicketSalesComponent } from './../../../../../ondeir_tickets/ticketsales/ticketsales.component';
import { TicketSalesDetailComponent } from './../../../../../ondeir_tickets/ticketsales-detail/ticketSales-detail.component';
import { TicketSalesSaleComponent } from './../../../../../ondeir_tickets/ticketsales-sale/ticketSales-sale.component';

import { M_EventsComponent } from './../../../../../ondeir_tickets/mobile/events/m-events.component';
import { M_EventDetailComponent } from './../../../../../ondeir_tickets/mobile/event-detail/m-event-detail.component';
import { M_VouchersComponent } from './../../../../../ondeir_tickets/mobile/vouchers/m-vouchers.component';

const routes: Routes = [
    {
        path: "", 
        component: TicketsComponent,
        children: [
            { path: '', redirectTo: 'home' },
            { path: 'home', component: TicketSalesComponent, canActivate: [TicketGuard]},
            { path: 'events', component: EventsComponent },
            { path: 'events/details', component: EventDetailComponent },
            { path: 'events/details/:id', component: EventDetailComponent },
            { path: 'events/sector/:eventId', component: SectorDetailComponent },
            { path: 'events/sector/details/:id', component: SectorDetailComponent },
            { path: 'events/type/:sectorId', component: TicketTypeDetailComponent },
            { path: 'events/type/details/:id', component: TicketTypeDetailComponent },
            { path: 'ticketSales', component: TicketSalesComponent },
            { path: 'ticketSales/detail/:id', component: TicketSalesDetailComponent },
            { path: 'ticketSales/sales/:eventId', component: TicketSalesSaleComponent },
            { path: 'ticketSales/sales/:eventId/:ticketSaleId/:transactionId/:userId', component: TicketSalesSaleComponent },

            { path: 'mobile/events', component: M_EventsComponent },
            { path: 'mobile/events/:id', component: M_EventDetailComponent },
            { path: 'mobile/vouchers/:userId', component: M_VouchersComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketsRoutingModule {

}
