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
import { SectorEntity } from '../../ondeir_admin_shared/models/tickets/sector.model';

@Component({
  selector: 'app-sector-detail',
  templateUrl: './sector-detail.component.html',
  styleUrls: ['./sector-detail.component.scss']
})
export class SectorDetailComponent extends BaseComponent implements OnInit {
  public storeType: number = 0;
  public sector;
  public sectorId: number = 0;
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
      this.sector = SectorEntity.GetInstance();

      if (params["id"]) {
        this.isNew = false;
        this.headerTitle = "Editar Setor";
        this.sectorId = params["id"];
        this.isProcessing = true;

        this.service.GetSector(this.sectorId).subscribe(
          ret => {
            this.isProcessing = false;
            this.sector = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Detalhe Setor", err);
          }
        );
      } else if (params["eventId"]) {
        this.isNew = true;
        this.headerTitle = "Criar novo Setor";
        this.sectorId = 0;
        this.sector.eventId = params["eventId"];
      } else {
        this.alert.alertError("Criando novo Setor", "Evento inválido");
        this.location.back();
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required]
    });
  }

  // Salva os dados do tipo
  onSave() {
    if (this.formIsValid()) {
      this.isProcessing = true;

      window.scrollTo(0, 0);

      if (this.isNew) {
        this.service.CreateSector(this.sector).subscribe(
          ret  => {
            this.isProcessing = false;
            this.alert.alertInformation("Setor", "Setor criado com sucesso");
            this.location.go('/tickets/events/' + this.sector.eventId);
            this.router.navigateByUrl('/tickets/events/sector/details/' + ret);
          },
          err => {
            this.alert.alertError("Criando novo Setor", err);
              this.isProcessing = false;
          }
        );
      } else {
        this.service.UpdateSector(this.sector).subscribe(
          ret => {
            this.isProcessing = false;
            this.alert.alertInformation("Setor", "Setor atualizado com sucesso");
          },
          err => {
            this.alert.alertError("Atualizar Setor", err);
              this.isProcessing = false;
          });
      }
    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Setor", "Deseja realmente excluir o Setor?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.DeleteSector(this.sector.id).subscribe(
          result => {
            this.router.navigateByUrl('/tickets/events/' + this.sector.eventId);
          },
          err => {
            this.alert.alertError("Excluir Setor", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }
}
