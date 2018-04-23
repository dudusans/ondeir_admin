import { Component, OnInit, Injector } from '@angular/core';

import { BaseComponent } from '../../../ondeir_admin_shared/base/base.component';
import { OffersEntity } from '../../../ondeir_admin_shared/models/offers/offers.model';
import { AlertService } from '../../../ondeir_admin_shared/modules/alert/alert.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent extends BaseComponent implements OnInit {
  offer: OffersEntity;
  canUse: boolean;

  constructor(alert: AlertService, private injector: Injector) {
    super(alert);

    if (this.injector.get("offer")) {
      this.offer = this.injector.get("offer");
    }

    if (this.injector.get("canUse")) {
      this.canUse = this.injector.get("canUse");
    }
  }

  ngOnInit() {

  }

}
