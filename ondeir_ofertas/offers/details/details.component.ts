import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap';
import { ptBrLocale } from 'ngx-bootstrap';
// import { Subscriber } from 'rxjs';

import { VoucherComponent } from '../voucher/voucher.component';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { OffersEntity } from '../../../ondeir_admin_shared/models/offers/offers.model';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { OffersService } from '../../shared/services/offers.service';
import { DialogService } from '../../../ondeir_admin_shared/modules/dialog/dialog.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends BaseComponent implements OnInit {
  headerTitle: string = "";
  isNew: boolean = false;
  activeStatus: boolean = false;

  offer: OffersEntity;

  constructor(alert: AlertService, private service: OffersService, private _localeService: BsLocaleService, private location: Location,
             private route: ActivatedRoute, private formBuilder: FormBuilder, private dialogService: DialogService) {
    super(alert);
  }

  ngOnInit() {
    // ajustando calendários
    defineLocale('pt-br', ptBrLocale);
    this._localeService.use('pt-br');

    // iniciando entidade de dados
    this.offer = OffersEntity.getInstance();

    this.initForm();

    this.route.params.subscribe( params => {
      if (params["id"]) {
        this.isProcessing = true;

        this.isNew = false;
        this.headerTitle = "Editar Oferta";

        this.service.GetOffers(params["id"]).subscribe(
          ret => {
            this.isProcessing = false;

            this.offer = ret;

            if (this.offer.status === 1) {
              this.activeStatus = true;
            }
          },
          err => {
              this.alert.alertError("Detalhe de Oferta", err);
              this.isProcessing = false;
          }
        );
      } else {
        this.isNew = true;
        this.headerTitle = "Criar Nova Oferta";
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      title: ["", Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      type: ["1", Validators.required ],
      restrictions: [""],
      description: [""],
      discount: [0],
      reward: [""]
    });
  }

  onOffersStatusChange() {
    this.isProcessing = true;

    if (this.activeStatus) {
      this.service.ActiveOffers(this.offer.id).subscribe(
        ret => {
          this.isProcessing = false;
        },
        err => {
          this.alert.alertError("Ativação de Oferta", err);
          this.isProcessing = false;
        }
      );
    } else {
      this.service.InactiveOffers(this.offer.id).subscribe(
        ret => {
          this.isProcessing = false;
        },
        err => {
          this.alert.alertError("Desativação de Oferta", err);
          this.isProcessing = false;
        }
      );
    }
  }

  onSave() {
    if (this.formIsValid) {
      this.isProcessing = true;

      window.scrollTo(0, 0);

      if (this.isNew) {
        this.offer.ownerId = this.loginInfo.userId;

        this.service.CreateOffers(this.offer).subscribe(
          ret => {
            this.isProcessing = false;

            this.alert.alertInformation("Ofertas", "Campanha de oferta criada com sucesso");

            this.location.back();
          },
          err => {
            this.alert.alertError("Criar Nova Oferta", err);
              this.isProcessing = false;
          });
      } else {
        this.service.UpdateOffers(this.offer).subscribe(
          ret => {
            this.isProcessing = false;

            this.alert.alertInformation("Ofertas", "Campanha de oferta atualizada com sucesso");
          },
          err => {
            this.alert.alertError("Atualizar Oferta", err);
              this.isProcessing = false;
          });
      }
    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Oferta", "Deseja realmente excluir a campanha de oferta?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.DeleteOffers(this.offer.id).subscribe(
          result => {
            this.location.back();
          },
          err => {
            this.alert.alertError("Excluir Oferta", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }

  onVoucher() {
    this.dialogService.dialogContent("Cupom de Desconto", {
      component: VoucherComponent,
      inputs: {
        offer: this.offer,
        canUse: false
      }
    }, this.closeVoucher, "Aprovar", "Fechar", false);
  }

  closeVoucher() {}
}
