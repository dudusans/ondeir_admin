import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../../shared/services/tickets.service';
import { AlertService } from '.././../../ondeir_admin_shared/modules/alert/alert.service';

@Component({
  selector: 'app-m-vouchers',
  templateUrl: './m-vouchers.component.html',
  styleUrls: ['./m-vouchers.component.scss']
})
export class M_VouchersComponent extends BaseComponent implements OnInit {
  vouchers: Array<any> = new Array<any>();
  public userId: number;

  constructor(alert: AlertService, private service: TicketsService, private location: Location, private route: ActivatedRoute) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.route.params.subscribe( params => {
      
      if (params["userId"]) {
        this.userId = params["userId"];

        this.service.ListVouchers(this.userId).subscribe(
          ret => {
            this.isProcessing = false;
            this.vouchers = ret;
            this.loadFeaturedImagens();
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Meus Ingressos", err);
          }
        );
      } else {
        this.isProcessing = false;
        this.alert.alertError("Meus Ingressos", "Dados do usuário inválido.");
        this.location.back();
      }
    }); 
  }

  loadFeaturedImagens() {
    this.vouchers.forEach(item => {
      item.event.featuredImage = item.event.featuredImage || "assets/images/no-image.jpg";
    });
  }

}
