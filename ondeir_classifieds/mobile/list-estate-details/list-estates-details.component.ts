import { EstatesEntity } from './../../../ondeir_admin_shared/models/classifieds/estates.model';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ClassifiedsService } from '../../shared/services/classifieds.service';
import { EEstateType } from '../../../ondeir_admin_shared/models/classifieds/estates.model';

@Component({
  selector: 'app-list-estates-details',
  templateUrl: './list-estates-details.component.html',
  styleUrls: ['./list-estates-details.component.scss']
})
export class ListEstatesDetailsComponent extends BaseComponent implements OnInit {
  public estates: EstatesEntity;
  public message: string;

  public userId: number = 0;
  public classifiedId: number = 0;

  constructor(alert: AlertService, private route: ActivatedRoute, private service: ClassifiedsService) { 
    super(alert);
  }

  ngOnInit() {

    this.isProcessing = true;

    this.route.params.subscribe( params => {

      if (params["id"]) { 
        this.classifiedId = params["id"];
        this.userId = params["userId"];

        this.service.GetEstates(params["id"]).subscribe(
          ret => {
            this.isProcessing = false;
            this.estates = ret;
          },
          err => {
            this.alert.alertError("Dados do anúncio", err);
            this.isProcessing = false;
          }
        );
      }
    });

  }

  getEstateType(type) {
    return EEstateType[type];
  }

  sendMessage() {
    if (this.message != "") {
      this.isProcessing = true;

      this.service.SendContact(this.userId, this.classifiedId, this.message).subscribe(
        ret => {
          this.isProcessing = false;

          this.message = "";

          scroll(0,0);
          this.alert.alertInformation("Contato", "Mensagem enviada com sucesso ao anunciante");
        },
        err => {
          this.isProcessing = false;
          this.alert.alertError("Enviar Contato", err);
        }
      );
    }
  }
}
