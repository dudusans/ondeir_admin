import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../../shared/services/tickets.service';
import { AlertService } from '.././../../ondeir_admin_shared/modules/alert/alert.service';

@Component({
  selector: 'app-m-events',
  templateUrl: './m-events.component.html',
  styleUrls: ['./m-events.component.scss']
})
export class M_EventsComponent extends BaseComponent implements OnInit {
  events: Array<any> = new Array<any>();
  public headerTitle: string = "";
  public cityId: number = 0;
  public userId: number = 0;

  constructor(alert: AlertService, private service: TicketsService, private route: ActivatedRoute) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = false;
    this.userId = 5; // USUÁRIO DE TESTE

    this.route.params.subscribe( params => {

      if (params["id"]) {
        this.cityId = params["id"];
        this.isProcessing = true;
        this.headerTitle = "Eventos " + params["cityName"]

        this.service.ListEventsByCity(this.cityId).subscribe(
          ret => {
            this.isProcessing = false;
            this.events = ret;
            this.loadFeaturedImagens();
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Eventos", err);
          }
        );
      } else {
        this.isProcessing = false;
        this.alert.alertError("Eventos", "Dados da cidade inválido ou não informados.");
      }
    });
  }

  loadFeaturedImagens() {
    this.events.forEach(item => {
      item.featuredImage = item.featuredImage || "assets/images/no-image.jpg";
    });
  }

}
