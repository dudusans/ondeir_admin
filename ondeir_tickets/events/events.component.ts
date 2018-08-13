import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../shared/services/tickets.service';
import { AlertService } from './../../ondeir_admin_shared/modules/alert/alert.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent extends BaseComponent implements OnInit {
  events: Array<any> = new Array<any>();

  constructor(alert: AlertService, private service: TicketsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    let ownerid = this.loginInfo.userId;

    this.service.ListEvents(ownerid).subscribe(
      ret => {
        this.isProcessing = false;

        this.events = ret;
      },
      err => {
        this.isProcessing = false;
        this.alert.alertError("Eventos", err);
      }
    );
  }

}
