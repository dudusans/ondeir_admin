import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../shared/services/tickets.service';
import { AlertService } from './../../ondeir_admin_shared/modules/alert/alert.service';
import { EventSalesEntity } from '../../ondeir_admin_shared/models/tickets/eventSales.model';

@Component({
  selector: 'app-ticketSales',
  templateUrl: './ticketSales.component.html',
  styleUrls: ['./ticketSales.component.scss']
})
export class TicketSalesComponent extends BaseComponent implements OnInit {
  ticketSales: Array<EventSalesEntity> = new Array<EventSalesEntity>();

  constructor(alert: AlertService, private service: TicketsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    let ownerid = this.loginInfo.userId;

    this.service.ListEventsSales(ownerid).subscribe(
      ret => {
        this.isProcessing = false;

        this.ticketSales = ret;
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Vendas", err);
      }
    );

    this.isProcessing = false;
  }

}
