import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../../shared/services/tickets.service';
import { AlertService } from '.././../../ondeir_admin_shared/modules/alert/alert.service';
import { EventEntity } from '../../../ondeir_admin_shared/models/tickets/event.model';
import { EventPhotoEntity } from '../../../ondeir_admin_shared/models/tickets/eventPhotos.model';

@Component({
  selector: 'app-m-event-detail',
  templateUrl: './m-event-detail.component.html',
  styleUrls: ['./m-event-detail.component.scss']
})
export class M_EventDetailComponent extends BaseComponent implements OnInit {
  photos: Array<any> = new Array<any>();
  public event: EventEntity;
  public eventId: number = 0;

  constructor(alert: AlertService, private service: TicketsService, private location: Location, private route: ActivatedRoute) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = false;

    this.route.params.subscribe( params => {
      this.event = EventEntity.GetInstance();

      if (params["id"]) {
        this.eventId = params["id"];
        this.isProcessing = true;

        this.service.GetEventPhotos(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.photos = ret;

            if(!this.photos || this.photos.length == 0) {
              var photo = EventPhotoEntity.GetInstance();
              photo.image = "assets/images/no-image.jpg";
              this.photos.push(photo);
            }
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Evento", err);
          }
        );

        this.service.GetAnnouncement(this.eventId).subscribe(
          ret => {
            this.isProcessing = false;
            this.event = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Evento", err);
          }
        );

      } else {
        this.isProcessing = false;
        this.location.back();
      }
    });
  }

}
