import { Component, OnInit } from '@angular/core';

import { OffersEntity } from '../../ondeir_admin_shared/models/offers/offers.model';
import { BaseComponent } from '../../ondeir_admin_shared/base/base.component';
import { OffersService } from '../shared/services/offers.service';
import { AlertService } from '../../ondeir_admin_shared/modules/alert/alert.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent extends BaseComponent implements OnInit {
  offers: Array<OffersEntity>;
  selectedStatusFilter: string = "0";

  constructor(alert: AlertService, private service: OffersService) {
    super(alert);
  }

  ngOnInit() {
    this.ListOffers();
  }

  private ListOffers() {
    this.isProcessing = true;

    this.service.ListOffers(this.loginInfo.userId).subscribe(
      ret => {
          this.isProcessing = false;

          this.offers = ret;
      },
      err => {
          this.alert.alertError("Ofertas", err);
          this.isProcessing = false;
      }
    );
  }

  private ListOffersByStatus() {
    this.isProcessing = true;

    this.service.ListOffersStatus(this.loginInfo.userId, this.selectedStatusFilter).subscribe(
      ret => {
          this.isProcessing = false;

          this.offers = ret;
      },
      err => {
          this.alert.alertError("Fidelidade", err);
          this.isProcessing = false;
      }
    );
  }

  onSelectChange() {
    if (this.selectedStatusFilter === "0") {
      this.ListOffers();
    } else {
      this.ListOffersByStatus();
    }
  }

}
