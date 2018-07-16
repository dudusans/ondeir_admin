import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { TicketsService } from './../shared/services/tickets.service';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { EventSalesDetailEntity } from '../../ondeir_admin_shared/models/tickets/eventSalesDetail.model';

@Component({
  selector: 'app-ticketSales-detail',
  templateUrl: './ticketSales-detail.component.html',
  styleUrls: ['./ticketSales-detail.component.scss']
})
export class TicketSalesDetailComponent extends BaseComponent implements OnInit {
  public detail;
  public event;
  public eventId: number = 0;

  public headerTitle: string = "";

  constructor(alert: AlertService, private service: TicketsService, private location: Location,
    private router: Router, private route: ActivatedRoute, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {

    this.route.params.subscribe( params => {
      this.detail = EventSalesDetailEntity.GetInstance();

      if (params["id"]) {
        this.eventId = params["id"];
        this.isProcessing = true;

        this.service.GetEvent(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.event = ret;

            this.headerTitle = this.event.name;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Vendas", err);
          }
        );

        this.service.ListEventsSalesDetail(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.detail = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Vendas", err);
          }
        );
      }
    });
  }
}
