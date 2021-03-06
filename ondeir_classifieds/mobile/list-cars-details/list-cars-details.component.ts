import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';
import { ActivatedRoute } from '@angular/router';
import { ClassifiedsService } from '../../shared/services/classifieds.service';
import { MotorsEntity } from '../../../ondeir_admin_shared/models/classifieds/motors.model';

@Component({
  selector: 'app-list-cars-details',
  templateUrl: './list-cars-details.component.html',
  styleUrls: ['./list-cars-details.component.scss']
})
export class ListCarsDetailsComponent extends BaseComponent implements OnInit {
  public car: MotorsEntity;
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

        this.service.GetCar(params["id"]).subscribe(
          ret => {
            this.isProcessing = false;
            this.car = ret;
          },
          err => {
            this.alert.alertError("Dados do anúncio", err);
            this.isProcessing = false;
          }
        );
      }
    });

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
