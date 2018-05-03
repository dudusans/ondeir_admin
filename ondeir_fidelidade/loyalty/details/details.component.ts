import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap';
import { ptBrLocale } from 'ngx-bootstrap';
import { Subscriber } from 'rxjs';

import { QrcodeComponent } from '../qrcode/qrcode.component';
import { CardComponent } from './../card/card.component';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { LoyaltyEntity } from '../../../ondeir_admin_shared/models/loyalty/loyalty';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { LoyaltyService } from '../../shared/services/loyalty.service';
import { DialogService } from '../../../ondeir_admin_shared/modules/dialog/dialog.service';
import { LoyaltyValidity } from '../../../ondeir_admin_shared/models/loyalty/loyaltyValidity';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends BaseComponent implements OnInit, OnDestroy {
  headerTitle: string = "";
  isNew: boolean = false;
  activeStatus: boolean = false;
  hasValidity: boolean = false;
  minDate: Date;

  loyalty: LoyaltyEntity;

  dialogSubscriber: any;
  printSubscriber: any;

  constructor(alert: AlertService, private route: ActivatedRoute, private formBuilder: FormBuilder, private dialogService: DialogService,
              private service: LoyaltyService, private _localeService: BsLocaleService, private location: Location) {
    super(alert);
  }

  ngOnInit() {
    // ajustando calendários
    defineLocale('pt-br', ptBrLocale);
    this._localeService.use('pt-br');

    // iniciando entidade de dados
    this.loyalty = LoyaltyEntity.getInstance();
    this.minDate = new Date();

    this.initForm();

    this.route.params.subscribe( params => {
      if (params["id"]) {
        this.isProcessing = true;

        this.isNew = false;
        this.headerTitle = "Editar Programa de Fidelidade";

        this.service.GetLoyalty(params["id"]).subscribe(
          ret => {
            this.isProcessing = false;

            this.loyalty = ret;

            if (this.loyalty.validity) {
              this.hasValidity = true;
            }

            if (this.loyalty.status === 2) {
              this.activeStatus = true;
            }
          },
          err => {
              this.alert.alertError("Detalhe de Fidelidade", err);
              this.isProcessing = false;
          }
        );
      } else {
        this.isNew = true;
        this.headerTitle = "Criar Novo Programa de Fidelidade";
      }
    });
  }

  ngOnDestroy() {
    if (this.dialogSubscriber) {
      this.dialogSubscriber.unsubscribe();
    }
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      name: ["", Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      type: [{ value: "Utilização", disabled: true }],
      dayLimit: [0],
      usageLimit: [0],
      usageType: this.formBuilder.group({
        usageGoal: [null, Validators.required],
        usageReward: ["", Validators.required]
      })
    });
  }

  // Verifica a ativação ou desativação de um programa
  onLoyaltyStatusChange() {
    this.isProcessing = true;

    if (this.activeStatus) {
      this.service.ActiveLoyalty(this.loyalty.id).subscribe(
        ret => {
          this.isProcessing = false;
        },
        err => {
            this.alert.alertError("Publicação de Fidelidade", err);
            this.isProcessing = false;
        });
    } else {
      this.service.InactiveLoyalty(this.loyalty.id).subscribe(
        ret => {
          this.isProcessing = false;
        },
        err => {
            this.alert.alertError("Inativação de Fidelidade", err);
            this.isProcessing = false;
        });
    }
  }

  onValidityAdd() {
    if (!this.loyalty.validity) {
      this.loyalty.validity = new Array<LoyaltyValidity>();
    }

    this.loyalty.validity.push(LoyaltyValidity.getInstance());
  }

  onValidityRemove(validity) {
    const index = this.loyalty.validity.indexOf(validity, 0);
    if (index > -1) {
      this.loyalty.validity.splice(index, 1);
    }
  }

  // Imprimi QR Code de identificação.
  onPrintQRCode() {
    if (!this.loyalty.qrHash || this.loyalty.qrHash === "") {
      this.alert.alertWarning("Impressão QR Code", "Ocorreu um erro na impressão do QR Code, tente novamente!");
      this.location.back();
    }

    this.dialogService.dialogContent("Imprimir QR Code", {
      component: QrcodeComponent,
      inputs: {
        qrcode: this.loyalty.qrHash
      }
    }, this.printQRCode, "Imprimir", "Cancelar", true);
  }

  printQRCode() {
    let printContents, popupWin;

    printContents = document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();

    popupWin.document.write(`
      <html>
        <head>
          <title>Impressão de QR Code - Programa de Fidelidade</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );

    popupWin.document.close();
  }

  // Visualiza modelo do cartão de fidelidade
  onLoyaltyCardView() {
    this.dialogService.dialogContent("Cartão de Fidelidade", {
      component: CardComponent,
      inputs: {
        loyalty: this.loyalty,
        program: null
      }
    }, this.closeCart, "Aprovar", "Fechar", false);
  }

  closeCart() {

  }

  publishNewCallback = (dialogResult) => {
    if (dialogResult) {
      //this.activeStatus = true;
      //this.onLoyaltyStatusChange();

      // Mostrar QR Code para impressão
      this.onPrintQRCode();

    } else {
      // Retorna para a listagem
      this.location.back();
    }




  }

  // Salva os dados do programa
  onSave() {
    if (this.formIsValid()) {
      this.isProcessing = true;

      window.scrollTo(0, 0);

      if (this.isNew) {
        this.loyalty.ownerId = this.loginInfo.userId;

        this.service.CreateLoyalty(this.loyalty).subscribe(
          ret => {
            this.isProcessing = false;

            this.dialogService.dialogConfirm("Programa de Fidelidade", "Imprimir o QR para pontuação no programa?",
              "Sim", "Não", this.publishNewCallback);

            this.isNew = false;

          },
          err => {
            this.alert.alertError("Criando novo Fidelidade", err);
              this.isProcessing = false;
          }
        );
      } else {
        this.service.UpdateLoyalty(this.loyalty).subscribe(
          ret => {
            this.isProcessing = false;

            this.alert.alertInformation("Fidelidade", "Programa de Fidelidade atualizado com sucesso");
          },
          err => {
            this.alert.alertError("Atualizar Fidelidade", err);
              this.isProcessing = false;
          });
      }
    }
  }

  onDelete() {
    this.dialogService.dialogConfirm("Excluir Fidelidade", "Deseja realmente excluir o programa de fidelidade?", "Excluir", "Cancelar", ret => {
      if (ret) {
        this.isProcessing = true;

        this.service.DeleteLoyalty(this.loyalty.id).subscribe(
          result => {
            this.location.back();
          },
          err => {
            this.alert.alertError("Excluir Fidelidade", err);
              this.isProcessing = false;
          }
        );
      }
    });
  }
}
