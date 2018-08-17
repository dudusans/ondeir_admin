import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { TicketsService } from '../../shared/services/tickets.service';
import { AlertService } from '.././../../ondeir_admin_shared/modules/alert/alert.service';
import { VoucherEntity } from '../../../ondeir_admin_shared/models/tickets/voucher.model';

@Component({
  selector: 'app-m-voucher-detail',
  templateUrl: './m-voucher-detail.component.html',
  styleUrls: ['./m-voucher-detail.component.scss']
})
export class M_VoucherDetailComponent extends BaseComponent implements OnInit {
  public voucher: VoucherEntity;
  public voucherId: number = 0;

  constructor(alert: AlertService, private service: TicketsService, private location: Location, private route: ActivatedRoute) { 
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = false;

    this.route.params.subscribe( params => {
      this.voucher = VoucherEntity.GetInstance();

      if (params["id"]) {
        this.voucherId = params["id"];
        this.isProcessing = true;

        this.service.GetVoucher(this.voucherId).subscribe(
          ret => {
            this.isProcessing = false;
            this.voucher = ret;
          },
          err => {
            this.isProcessing = false;
            this.alert.alertError("Ingresso", err);
          }
        );

      } else {
        this.isProcessing = false;
        this.location.back();
      }
    });
  }

}
