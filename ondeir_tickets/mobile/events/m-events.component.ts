import { Component, OnInit } from '@angular/core';

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
  public headerTitle: string = "Eventos ";

  constructor(alert: AlertService, private service: TicketsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    let cityId = 21;
    this.headerTitle += "Curitiba"

    this.service.ListEventsByCity(cityId).subscribe(
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
  }

  loadFeaturedImagens() {
    this.events.forEach(item => {
      item.featuredImage = item.featuredImage || "assets/images/no-image.jpg";
    });
  }

}
