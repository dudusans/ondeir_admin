import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap';
import { ptBrLocale } from 'ngx-bootstrap';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { TicketsService } from './../shared/services/tickets.service';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { EventSalesTicketEntity } from '../../ondeir_admin_shared/models/tickets/eventSalesTicket.model';
import { BuyerInfoEntity } from '../../ondeir_admin_shared/models/tickets/buyerInfo.model';
import { EventEntity } from '../../ondeir_admin_shared/models/tickets/event.model';
import { CardTransactionEntity } from '../../ondeir_admin_shared/models/tickets/cardTransaction.model';

@Component({
  selector: 'app-ticketSales-sale',
  templateUrl: './ticketSales-sale.component.html',
  styleUrls: ['./ticketSales-sale.component.scss']
})
export class TicketSalesSaleComponent extends BaseComponent implements OnInit {
  tickets: Array<any> = new Array<any>();
  ticketsTypes: Array<any> = new Array<any>();
  users: Array<any> = new Array<any>();
  public event;
  public cardTransaction;
  public buyerInfo;
  public eventId: number = 0;
  public ticketSaleId: number = 0;
  public transactionId: number = 0;
  public userId: number = 0;
  public isNew: boolean = true;

  public headerTitle: string = "";

  constructor(alert: AlertService, private service: TicketsService, private _localeService: BsLocaleService, private location: Location,
    private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {

    this.initForm();

    // ajustando calendários
    defineLocale('pt-br', ptBrLocale);
    this._localeService.use('pt-br');

    this.route.params.subscribe( params => {
      this.event = EventEntity.GetInstance();
      this.buyerInfo = BuyerInfoEntity.GetInstance();
      this.cardTransaction = CardTransactionEntity.GetInstance();

      if (params["eventId"]) {
        this.eventId = params["eventId"];
        this.isProcessing = true;
        this.isNew = true;

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

        // Se Alteração
        if (params["ticketSaleId"]) {
          this.isNew = false;
          this.userId = params["userId"];
          this.ticketSaleId = params["ticketSaleId"];
          this.transactionId = params["transactionId"];

          // Dados do Usuário
          this.service.GetBuyerInfo(this.userId).subscribe(
            ret => {
              this.isProcessing = false;
              this.buyerInfo = ret;
            },
            err => {
              this.isProcessing = false;
              this.alert.alertError("Detalhe do Comprador", err);
            }
          );

          // Dados da Compra
          this.service.ListEventsSalesTicket(this.isNew, this.ticketSaleId).subscribe(
            ret => {
              this.isProcessing = false;
              this.tickets = ret;
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
        
        } else {
          // Carregar os usuários
          this.service.ListUsers().subscribe(
            ret => {
              this.isProcessing = false;
              this.users = ret;
            },
            err => {
              this.isProcessing = false;
              this.alert.alertError("Lista de Usuários", err);
            }
          );

          // Carregar os tipos de ingresso
          this.service.ListEventsSalesTicket(this.isNew, this.eventId).subscribe(
            ret => {
              this.isProcessing = false;
              this.tickets = ret;
            },
            err => {
              this.isProcessing = false;
              this.alert.alertError("Detalhe Vendas", err);
            }
          );
        }
      } else {
        this.alert.alertError("Nova Venda", "Evento inválido");
        this.location.back();
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      document: ["", Validators.required],
      zipcode: ["", Validators.required],
      address: ["", Validators.required]
    });
  }

}
