import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';
import { ReportsService } from '../shared/services/reports.service';

@Component({
  selector: 'app-offers-coupons',
  templateUrl: './offers-coupons.component.html',
  styleUrls: ['./offers-coupons.component.scss']
})
export class OffersCouponsComponent extends BaseComponent implements OnInit {

  coupons: Array<any> = new Array<any>();

  constructor(alert: AlertService, private service: ReportsService) {
    super(alert);
  }

  ngOnInit() {
    this.isProcessing = true;

    this.service.ListCoupons(this.loginInfo.userId).subscribe(
      ret => {
          this.isProcessing = false;

          this.coupons = ret;
      },
      err => {
          this.alert.alertError("Listar Cupons de Ofertas", err);
          this.isProcessing = false;
      }
    );
  }
}
