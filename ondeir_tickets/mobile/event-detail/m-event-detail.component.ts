import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../../shared/services/tickets.service';
import { AlertService } from '.././../../ondeir_admin_shared/modules/alert/alert.service';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';

@Component({
  selector: 'app-m-event-detail',
  templateUrl: './m-event-detail.component.html',
  styleUrls: ['./m-event-detail.component.scss']
})
export class M_EventDetailComponent extends BaseComponent implements OnInit {
  public event: EventEntity;

  constructor(alert: AlertService, private service: TicketsService) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = false;

  }

  loadFeaturedImagens() {
    this.event.photos.forEach(item => {
      item.image = item.image || "assets/images/no-image.jpg";
    });
  }

}
