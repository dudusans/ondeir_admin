import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { TicketsService } from './../shared/services/tickets.service';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { EventSalesTicketEntity } from '../../ondeir_admin_shared/models/tickets/eventSalesTicket.model';

@Component({
  selector: 'app-ticketSales-sale',
  templateUrl: './ticketSales-sale.component.html',
  styleUrls: ['./ticketSales-sale.component.scss']
})
export class TicketSalesSaleComponent extends BaseComponent implements OnInit {
  public detail;
  public event;
  public cardTransaction;
  public buyerInfo;
  public eventId: number = 0;
  public ticketSaleId: number = 0;
  public transactionId: number = 0;
  public userId: number = 0;

  public headerTitle: string = "";

  constructor(alert: AlertService, private service: TicketsService, private location: Location,
    private router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {

    this.route.params.subscribe( params => {
      this.detail = EventSalesTicketEntity.GetInstance();

      if (params["eventId"]) {
        this.eventId = params["eventId"];
        this.ticketSaleId = params["ticketSaleId"];
        this.transactionId = params["transactionId"];
        this.userId = params["userId"];
        this.isProcessing = true;

        // Dados do Evento
        this.service.GetEvent(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.event = ret;

            this.headerTitle = this.event.name;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe do Evento", err);
          }
        );

        // Dados do Usuário
        this.service.GetBuyerInfo(this.userId).subscribe(
          ret => {
            this.isProcessing = false;
            this.buyerInfo = ret;

            this.headerTitle = this.event.name;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe do Comprador", err);
          }
        );

        // Dados da Compra
        this.service.ListEventsSalesTicket(this.ticketSaleId).subscribe(
          ret => {
            this.isProcessing = false;
            this.detail = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Vendas", err);
          }
        );

        // Dados do Pagamento
        this.service.GetCardTransaction(this.transactionId).subscribe(
          ret => {
            this.isProcessing = false;
            this.cardTransaction = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe do Pagamento", err);
          }
        );
      }
    });
  }
}
