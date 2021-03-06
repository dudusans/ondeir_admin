import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../../shared/services/tickets.service';
import { AlertService } from '.././../../ondeir_admin_shared/modules/alert/alert.service';
import { BuyerInfoEntity } from '../../../ondeir_admin_shared/models/tickets/buyerInfo.model';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';
import { CardTransactionEntity } from '../../../ondeir_admin_shared/models/tickets/cardTransaction.model';
import { TicketSaleEntity } from '../../../ondeir_admin_shared/models/tickets/ticketSale.model';
import { VoucherEntity } from '../../../ondeir_admin_shared/models/tickets/voucher.model';
import { CardInfoEntity } from '../../../ondeir_admin_shared/models/tickets/cardInfo.model';

declare var PagSeguroDirectPayment: any;

@Component({
  selector: 'app-m-ticket-sale',
  templateUrl: './m-ticket-sale.component.html',
  styleUrls: ['./m-ticket-sale.component.scss']
})
export class M_TicketSaleComponent extends BaseComponent implements OnInit {
  public event: EventEntity;
  public cardTransaction: CardTransactionEntity;
  public cardInfo: CardInfoEntity;
  public buyerInfo: BuyerInfoEntity;
  public ticketSaleEntity: TicketSaleEntity;
  public eventId: number = 0;
  public userId: number = 0;
  public step: number = 1;
  public buttonText: string;

  constructor(alert: AlertService, private service: TicketsService, private location: Location, private route: ActivatedRoute, private formBuilder: FormBuilder) { 
    super(alert);
  }

  ngOnInit() {

    this.initForm();

    this.isProcessing = true;

    this.userId = 5; // USUÁRIO DE TESTE

    this.route.params.subscribe( params => {
      this.event = EventEntity.GetInstance();
      this.buyerInfo = BuyerInfoEntity.GetInstance();
      this.cardTransaction = CardTransactionEntity.GetInstance();
      this.cardInfo = CardInfoEntity.GetInstance();
      this.ticketSaleEntity = TicketSaleEntity.GetInstance();

      if (params["id"]) {
        this.eventId = params["id"];
        this.cardTransaction.status = 1;
        this.step = 1;
        this.buttonText = "Forma de pagamento";

        this.service.GetAnnouncement(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.event = ret;
            this.event.featuredImage = this.event.featuredImage || "assets/images/no-image.jpg";

            this.event.sectors.forEach(sector => { 
              sector.ticketTypes.forEach(type => { 
                type.amount = 0;
              });
            });
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Evento", err);
          }
        );

      } else {
        this.isProcessing = false;
        this.alert.alertError("Comprar ingresso", "Dados do evento inválido ou não informados.");
        this.location.back();
      }
    });
  }

  // Inicializa os campos do formulário
  initForm() {
    this.formFields = this.formBuilder.group({
      document: ["", Validators.required],
      zipCode: ["", Validators.required],
      address: ["", Validators.required],
      district: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      number: ["", Validators.required],
      identifier: ["", Validators.required],
      card: ["", Validators.required],
      cardName: ["", Validators.required],
      valid: ["", Validators.required],
      cvv: ["", Validators.required],
    });
  }

  onIncrease(item) {
    item.amount = item.amount + 1;
    this.onChangeValues(item);
  }

  onDecrease(item) {
    item.amount = (item.amount - 1) > 0 ? item.amount - 1 : 0;
    this.onChangeValues(item);
  }

  onChangeValues(item) {
    this.cardTransaction.total = 0;
    this.event.sectors.forEach(sector => { 
      sector.ticketTypes.forEach(type => {
        if (type.amount > 0) {
          this.cardTransaction.total += (type.amount * type.total);
        }
      });
    });
  }

  onCEPChange(cep: string) {
    console.log(cep);

    if (cep != "" && cep.length == 8) {
      this.service.ConsultCEP(cep).subscribe(
        ret => {
          this.buyerInfo.address = ret.logradouro;
          this.buyerInfo.district = ret.bairro;
          this.buyerInfo.city = ret.localidade;
          this.buyerInfo.state = ret.uf;          
        }
      );    
    }
  }

  startPayment(cardNumber) {
    this.service.getSessionId("ingressos@appondeir.com.br", "3E1FEB5780844220A58412FEF0516159").subscribe(
      ret => {
        PagSeguroDirectPayment.setSessionId(ret);

        PagSeguroDirectPayment.getBrand({
          cardBin: cardNumber,
            success: function(response) {
              console.log(response);
    
            //   var param = {
            //     cardNumber: document.getElementById('#cartao').value,
            //     brand: document.getElementById('#bandeira').value,
            //     cvv: document.getElementById('#cvv').value,
            //     expirationMonth: document.getElementById('#validadeMes').value,
            //     expirationYear: document.getElementById('#validadeAno').value,
            //     success: function(response) {
            //         //token gerado, esse deve ser usado na chamada da API do Checkout Transparente
            //     },
            //     error: function(response) {
            //         //tratamento do erro
            //     },
            //     complete: function(response) {
            //         //tratamento comum para todas chamadas
            //     }
            // }
            // PagSeguroDirectPayment.createCardToken(param);
            },
            error: function(response) {
              console.log(response);
              //tratamento do erro
            },
            complete: function(response) {
              //tratamento comum para todas chamadas
            }
        });
      }
    );

    
  }

  onChangeStep() {
    this.isProcessing = true;
    window.scrollTo(0, 0);

    switch (this.step) {
      case 1:
        this.ticketSaleEntity.vouchers = Array<VoucherEntity>();
        this.event.sectors.forEach(sector => { 
          sector.ticketTypes.forEach(type => {
            if (type.amount > 0) {
              var voucher: VoucherEntity = VoucherEntity.GetInstance();
              voucher.ticketType = type;
              voucher.sector = sector;
              voucher.ticketTypeId = type.id;
              voucher.amount = type.amount;
              this.ticketSaleEntity.vouchers.push(voucher);
            }
          });
        });

        if(this.ticketSaleEntity.vouchers.length == 0) {
          this.alert.alertWarning("Comprar ingresso", "Selecione a quantidade de ingressos que deseja comprar.");
        } else {
          console.log(this.loginInfo);
          this.service.GetBuyerInfo(this.userId).subscribe(
            ret => {
              this.isProcessing = false;
              this.buyerInfo = ret;
              this.step = 2;
              this.buttonText = "Finalizar compra";
            },
            err => {
              this.isProcessing = false;
              this.alert.alertError("Comprar ingresso", "Erro ao recuperar as informações do usuário.");
            }
          );
        }
        break;   
      
      case 2:
        this.startPayment(this.cardInfo.cardNumber);
        // return;

        if (this.formIsValid()) {
          this.isProcessing = true;
    
          this.ticketSaleEntity.eventId = this.eventId;
          this.ticketSaleEntity.buyerInfo = this.buyerInfo;
          this.ticketSaleEntity.cardTransaction = this.cardTransaction;
          this.ticketSaleEntity.cardInfo = this.cardInfo;          
    
          this.service.CreateSale(this.ticketSaleEntity).subscribe(
            ret => {
              this.isProcessing = false;
              this.alert.alertInformation("Comprar ingresso", "Compra realizada com sucesso");
              this.location.back();
            },
            err => {
              this.isProcessing = false;
              this.alert.alertError("Comprar ingresso", err);
            }
          );
        }
        
        break;   
    
      default:
        break;
    }
  }
}
