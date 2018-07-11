import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap';
import { ptBrLocale } from 'ngx-bootstrap';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { TicketsService } from './../shared/services/tickets.service';
import { DialogService } from '../../ondeir_admin_shared/modules/dialog/dialog.service';
import { TicketTypeEntity } from '../../ondeir_admin_shared/models/tickets/ticketType.model';

@Component({
  selector: 'app-tickettype-detail',
  templateUrl: './tickettype-detail.component.html',
  styleUrls: ['./tickettype-detail.component.scss']
})
export class TicketTypeDetailComponent extends BaseComponent implements OnInit {
  public storeType: number = 0;
  public ticketType;
  public ticketTypeId: number = 0;
  public isNew: boolean = true;

  public headerTitle: string = "";

  constructor(alert: AlertService, private service: TicketsService, private _localeService: BsLocaleService, private location: Location,
    private route: ActivatedRoute, private formBuilder: FormBuilder, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {

    this.initForm();

    // ajustando calendários
    defineLocale('pt-br', ptBrLocale);
    this._localeService.use('pt-br');

    this.route.params.subscribe( params => {
      this.ticketType = TicketTypeEntity.GetInstance();

      if (params["id"]) {
        this.isNew = false;
        this.headerTitle = "Editar Tipo de Ingresso";
        this.ticketTypeId = params["id"];
        this.isProcessing = true;

        this.service.GetTicketType(this.ticketTypeId).subscribe(
          ret => {
            this.isProcessing = false;
            this.ticketType = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Tipo de Ingresso", err);
          }
        );
      } else if (params["sectorId"]) {
        this.isNew = true;
        this.headerTitle = "Criar Tipo de Ingresso";
        this.ticketTypeId = 0;
        this.ticketType.sectorId = params["sectorId"];
      } else {
        this.alert.alertError("Criando novo Tipo de Ingresso", "Setor inválido");
        this.location.back();
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required],
      value: ["", Validators.required],
      tax: ["", Validators.required],
      total: ["", Validators.required],
      amount: ["", Validators.required],
      sold: [""]
    });
  }

  // Salva os dados do tipo
  onSave() {
    if (this.formIsValid()) {
      this.isProcessing = true;

      window.scrollTo(0, 0);

      if (this.isNew) {
        this.ticketType.ownerId = this.loginInfo.userId;

        this.service.CreateTicketType(this.ticketType).subscribe(
          ret => {
            this.isProcessing = false;
            this.alert.alertInformation("Tipo de Ingresso", "Tipo de Ingresso criado com sucesso");
            this.location.back();
          },
          err => {
            this.alert.alertError("Criando novo Tipo de Ingresso", err);
              this.isProcessing = false;
          }
        );
      } else {
        this.service.UpdateTicketType(this.ticketType).subscribe(
          ret => {
            this.isProcessing = false;
            this.alert.alertInformation("Tipo de Ingresso", "Tipo de Ingresso atualizado com sucesso");
            this.location.back();
          },
          err => {
            this.alert.alertError("Atualizar Tipo de Ingresso", err);
              this.isProcessing = false;
          });
      }
    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Tipo de Ingresso", "Deseja realmente excluir o Tipo de Ingresso?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.DeleteTicketType(this.ticketType.id).subscribe(
          result => {
            this.location.back();
          },
          err => {
            this.alert.alertError("Excluir Tipo de Ingresso", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }
}
